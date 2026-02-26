"use client";

import { ChevronLeft, ChevronRight, Clock3, User2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { getBookings, BookingResponse, SessionTypeEnum, deleteBooking, updateBooking } from "@/lib/api/booking";
import { toast } from "react-toastify";

const tabs = ["Upcoming", "Completed", "Cancelled"] as const;

type BookingStatus = (typeof tabs)[number];

type BookingDisplay = {
    id: string;
    month: string;
    day: string;
    title: string;
    mode: string;
    instructor: string;
    time: string;
    duration: string;
    status: BookingStatus;
    dateISO: string;
    email: string;
    phone: string;
    fullName: string;
    specialRequest?: string;
    paymentMethod: "esewa" | "khalti" | "cash";
    amount: number;
    sessionType: SessionTypeEnum;
    sessionMode: "private" | "group";
    durationMinutes: number;
};

const sessionTypes: SessionTypeEnum[] = [
    "Yoga Practice",
    "Guided Meditation",
    "Breathwork Session",
    "Mantra Chanting",
    "Stress Relief Session",
    "Mindfulness Coaching",
    "Sleep & Relaxation",
    "Energy Balancing",
];

const timeSlots = ["08:00 AM", "09:30 AM", "11:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

const weekdayLabels = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
});

const toDateKey = (date: Date) => {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().split("T")[0];
};

const formatBookingForDisplay = (booking: BookingResponse): BookingDisplay => {
    const bookingDate = new Date(booking.booking_date);
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    
    return {
        id: booking.id,
        month: monthFormatter.format(bookingDate).toUpperCase(),
        day: bookingDate.getDate().toString().padStart(2, "0"),
        title: booking.session_type,
        mode: booking.session_mode.toUpperCase(),
        instructor: booking.instructor || "Instructor",
        time: booking.time_slot,
        duration: `${booking.duration_minutes} min`,
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) as BookingStatus,
        dateISO: booking.booking_date.split("T")[0],
        email: booking.email,
        phone: booking.phone,
        fullName: booking.full_name,
        specialRequest: booking.special_request,
        paymentMethod: booking.payment_method,
        amount: booking.amount,
        sessionType: booking.session_type,
        sessionMode: booking.session_mode,
        durationMinutes: booking.duration_minutes,
    };
};

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState<BookingStatus>("Upcoming");
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
    const [visibleMonth, setVisibleMonth] = useState(new Date());
    const [bookings, setBookings] = useState<BookingDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingBooking, setEditingBooking] = useState<BookingDisplay | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [editForm, setEditForm] = useState({
        session_type: "Yoga Practice" as SessionTypeEnum,
        booking_date: "",
        time_slot: "09:30 AM",
        session_mode: "private" as "private" | "group",
        full_name: "",
        email: "",
        phone: "",
        special_request: "",
        payment_method: "esewa" as "esewa" | "khalti" | "cash",
        amount: 1500,
        duration_minutes: 60,
    });

    // Fetch bookings on mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                setError("");
                const data = await getBookings();
                const formattedBookings = data.map(formatBookingForDisplay);
                setBookings(formattedBookings);
            } catch (err: any) {
                setError(err.message || "Failed to fetch bookings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const firstWeekday = monthStart.getDay();

    const activeTabBookings = useMemo(
        () => bookings.filter((booking) => booking.status === activeTab),
        [activeTab]
    );

    const bookingDatesInMonth = useMemo(() => {
        const monthPrefix = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, "0")}-`;
        return new Set(
            activeTabBookings
                .filter((booking) => booking.dateISO.startsWith(monthPrefix))
                .map((booking) => Number(booking.dateISO.split("-")[2]))
        );
    }, [activeTabBookings, visibleMonth]);

    const filteredBookings = useMemo(() => {
        if (!selectedDateKey) return activeTabBookings;
        return activeTabBookings.filter((booking) => booking.dateISO === selectedDateKey);
    }, [activeTabBookings, selectedDateKey]);

    const calendarDays = useMemo(() => {
        const cells: Array<{ day: number | null; dateKey: string | null }> = [];

        for (let i = 0; i < firstWeekday; i++) {
            cells.push({ day: null, dateKey: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
            cells.push({ day, dateKey: toDateKey(cellDate) });
        }

        while (cells.length % 7 !== 0) {
            cells.push({ day: null, dateKey: null });
        }

        return cells;
    }, [daysInMonth, firstWeekday, visibleMonth]);

    const handlePreviousMonth = () => {
        setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleDateSelect = (dateKey: string | null) => {
        if (!dateKey) return;
        setSelectedDateKey((current) => (current === dateKey ? null : dateKey));
    };

    const openEditModal = (booking: BookingDisplay) => {
        setEditingBooking(booking);
        setEditForm({
            session_type: booking.sessionType,
            booking_date: booking.dateISO,
            time_slot: booking.time,
            session_mode: booking.sessionMode,
            full_name: booking.fullName,
            email: booking.email,
            phone: booking.phone,
            special_request: booking.specialRequest || "",
            payment_method: booking.paymentMethod,
            amount: booking.amount,
            duration_minutes: booking.durationMinutes,
        });
    };

    const closeEditModal = () => {
        setEditingBooking(null);
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;
        try {
            setDeletingId(bookingId);
            await deleteBooking(bookingId);
            setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
            toast.success("Booking deleted successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete booking");
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdateBooking = async () => {
        if (!editingBooking) return;
        if (!editForm.booking_date || !editForm.full_name || !editForm.email || !editForm.phone) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setSavingEdit(true);
            const updated = await updateBooking(editingBooking.id, {
                session_type: editForm.session_type,
                booking_date: editForm.booking_date,
                time_slot: editForm.time_slot,
                session_mode: editForm.session_mode,
                full_name: editForm.full_name,
                email: editForm.email,
                phone: editForm.phone,
                special_request: editForm.special_request || undefined,
                payment_method: editForm.payment_method,
                amount: editForm.amount,
                duration_minutes: editForm.duration_minutes,
            });

            const updatedDisplay = formatBookingForDisplay(updated);
            setBookings((prev) => prev.map((item) => (item.id === updatedDisplay.id ? updatedDisplay : item)));
            toast.success("Booking updated successfully");
            closeEditModal();
        } catch (err: any) {
            toast.error(err.message || "Failed to update booking");
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-50 via-slate-50 to-slate-100 text-slate-900">
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                </div>

                {isLoading && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                        <p className="text-slate-600 mt-4">Loading your bookings...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-700">
                        <p className="font-semibold">Error loading bookings</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <section className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
                    <div>
                        <div className="flex items-center gap-8 border-b border-slate-200">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative pb-3 text-sm font-medium transition ${
                                            isActive ? "text-violet-600" : "text-slate-500 hover:text-slate-700"
                                        }`}
                                    >
                                        {tab}
                                        {isActive && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-violet-600 rounded-full" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6">
                            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase mb-4 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                                {activeTab} Sessions
                            </p>

                            <div className="space-y-4">
                                {filteredBookings.map((booking) => {
                                    return (
                                        <article
                                            key={booking.id}
                                            className="bg-white border border-slate-200 rounded-3xl p-4 md:p-5 shadow-sm"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                                <div className="flex items-center gap-4 md:gap-5 min-w-0">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center shrink-0">
                                                        <span className="text-[10px] font-bold tracking-wide text-violet-600">{booking.month}</span>
                                                        <span className="text-3xl leading-none font-bold text-violet-700">{booking.day}</span>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h2 className="text-3xl leading-tight md:text-[30px] font-semibold text-slate-900">{booking.title}</h2>
                                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                                                                {booking.mode}
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                                            <span className="inline-flex items-center gap-1">
                                                                <User2 className="w-4 h-4" /> {booking.instructor}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1">
                                                                <Clock3 className="w-4 h-4" /> {booking.time} ({booking.duration})
                                                            </span>
                                                        </div>

                                                        {booking.status === "Upcoming" && (
                                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditModal(booking)}
                                                                    className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    disabled={deletingId === booking.id}
                                                                    onClick={() => handleDeleteBooking(booking.id)}
                                                                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                                                                >
                                                                    {deletingId === booking.id ? "Deleting..." : "Delete"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}

                                {filteredBookings.length === 0 && (
                                    <div className="bg-white border border-slate-200 rounded-3xl p-6 text-sm text-slate-500">
                                        No {activeTab.toLowerCase()} sessions found for the selected date.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-800 uppercase">{monthLabelFormatter.format(visibleMonth)}</h3>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button
                                    type="button"
                                    onClick={handlePreviousMonth}
                                    className="w-6 h-6 rounded-full hover:bg-slate-100 inline-flex items-center justify-center"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="w-6 h-6 rounded-full hover:bg-slate-100 inline-flex items-center justify-center"
                                    aria-label="Next month"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-7 gap-y-3 text-center">
                            {weekdayLabels.map((day) => (
                                <span key={day} className="text-[10px] font-semibold text-slate-400">
                                    {day}
                                </span>
                            ))}

                            {calendarDays.map((cell, index) => {
                                const isSelected = cell.dateKey !== null && selectedDateKey === cell.dateKey;
                                const hasDot = cell.day !== null && bookingDatesInMonth.has(cell.day);
                                return (
                                    <button
                                        key={`${cell.day ?? "empty"}-${index}`}
                                        type="button"
                                        disabled={cell.day === null}
                                        onClick={() => handleDateSelect(cell.dateKey)}
                                        className={`relative text-sm h-7 flex items-center justify-center rounded-full ${
                                            cell.day === null
                                                ? "cursor-default text-transparent"
                                                : "text-slate-500 hover:bg-slate-100"
                                        } ${isSelected ? "border border-violet-500 text-violet-700" : ""} ${
                                            hasDot ? "text-violet-700 font-semibold" : ""
                                        }`}
                                    >
                                        {cell.day ?? ""}
                                        {hasDot && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-violet-600" />}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedDateKey(null)}
                            className="mt-4 text-xs font-semibold text-violet-600 hover:text-violet-700"
                        >
                            Clear date filter
                        </button>
                    </aside>
                </section>
                )}
            </main>

            {editingBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-slate-900">Edit Booking</h2>
                        <p className="mt-1 text-sm text-slate-500">Update your upcoming session details.</p>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Session Type</label>
                                <select value={editForm.session_type} onChange={(e) => setEditForm((prev) => ({ ...prev, session_type: e.target.value as SessionTypeEnum }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                                    {sessionTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Date</label>
                                <input type="date" value={editForm.booking_date} onChange={(e) => setEditForm((prev) => ({ ...prev, booking_date: e.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Time Slot</label>
                                <select value={editForm.time_slot} onChange={(e) => setEditForm((prev) => ({ ...prev, time_slot: e.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Session Mode</label>
                                <select value={editForm.session_mode} onChange={(e) => setEditForm((prev) => ({ ...prev, session_mode: e.target.value as "private" | "group" }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                                    <option value="private">Private</option>
                                    <option value="group">Group</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
                                <input type="text" value={editForm.full_name} onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                                <input type="email" value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
                                <input type="text" value={editForm.phone} onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Payment Method</label>
                                <select value={editForm.payment_method} onChange={(e) => setEditForm((prev) => ({ ...prev, payment_method: e.target.value as "esewa" | "khalti" | "cash" }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                                    <option value="esewa">eSewa</option>
                                    <option value="khalti">Khalti</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Special Request</label>
                                <textarea rows={3} value={editForm.special_request} onChange={(e) => setEditForm((prev) => ({ ...prev, special_request: e.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button type="button" onClick={closeEditModal} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                            <button type="button" disabled={savingEdit} onClick={handleUpdateBooking} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
                                {savingEdit ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
