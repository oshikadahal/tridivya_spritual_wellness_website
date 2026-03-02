"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createBooking, SessionTypeEnum, SessionModeEnum } from "@/lib/api/booking";
import { initiateEsewaV2Payment } from "@/lib/api/esewa";
import { getAuthHeaders } from "@/lib/api/content";
import { useAuth } from "@/context/AuthContext";

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

export default function BookingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedType, setSelectedType] = useState<SessionTypeEnum>(sessionTypes[0]);
    const [selectedSlot, setSelectedSlot] = useState("09:30 AM");
    const [isPrivate, setIsPrivate] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<"esewa">("esewa");
    const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}` : "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState("");
    const [specialRequest, setSpecialRequest] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalAmount = isPrivate ? 1500 : 1000;
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDate = today.toISOString().split("T")[0];

    const handleSubmit = async () => {
        // Validation
        if (!selectedDate) {
            toast.error("Please select a date");
            return;
        }
        if (!fullName.trim()) {
            toast.error("Please enter your full name");
            return;
        }
        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }
        if (!phone.trim()) {
            toast.error("Please enter your phone number");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Create booking
            const booking = await createBooking({
                session_type: selectedType,
                session_mode: isPrivate ? "private" : "group",
                booking_date: selectedDate,
                time_slot: selectedSlot,
                full_name: fullName,
                email: email,
                phone: phone,
                special_request: specialRequest || undefined,
                payment_method: paymentMethod,
                amount: totalAmount,
                duration_minutes: 60,
            });
            // Defensive: Ensure booking and booking.id exist
            if (!booking || !booking.id) {
                toast.error("Booking creation failed: missing booking ID. Please try again or contact support.");
                setIsSubmitting(false);
                return;
            }
            // 2. Initiate eSewa v2 payment
            const { esewaUrl, formData } = await initiateEsewaV2Payment(totalAmount, booking.id);
            // 3. Create and submit form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = esewaUrl;
            Object.entries(formData).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
        } catch (err: any) {
            toast.error(err.message || "Failed to create booking. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <section className="mx-auto max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-900">Book a Session</h1>
                        <p className="text-slate-500 mt-1">Schedule your next step towards wellness.</p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="sessionType" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Session Type
                                </label>
                                <select
                                    id="sessionType"
                                    value={selectedType}
                                    onChange={(event) => setSelectedType(event.target.value as SessionTypeEnum)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    {sessionTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Session Mode</label>
                                <button
                                    type="button"
                                    onClick={() => setIsPrivate((prev) => !prev)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 flex items-center justify-between"
                                >
                                    <span>{isPrivate ? "Private One-on-One" : "Group Session"}</span>
                                    <span
                                        className={`w-11 h-6 rounded-full relative transition ${
                                            isPrivate ? "bg-violet-600" : "bg-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                                                isPrivate ? "left-5" : "left-0.5"
                                            }`}
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                min={minDate}
                                value={selectedDate}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    if (value >= minDate) {
                                        setSelectedDate(value);
                                    }
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-700 mb-3">Available Time Slots</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {timeSlots.map((slot) => {
                                    const isSelected = selectedSlot === slot;
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                                isSelected
                                                    ? "border-violet-500 text-violet-700 bg-violet-50"
                                                    : "border-slate-300 text-slate-700 hover:border-violet-300"
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 space-y-4">
                            <h3 className="text-xs tracking-[0.15em] text-slate-500 font-semibold uppercase">Personal Information</h3>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. Aarya Sharma"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="aarya@example.com"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+977 98XXXXXXXX"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="specialRequest" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Special Request (Optional)
                                </label>
                                <textarea
                                    id="specialRequest"
                                    rows={4}
                                    value={specialRequest}
                                    onChange={(e) => setSpecialRequest(e.target.value)}
                                    placeholder="Any injuries, preferences, or goals we should know about?"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 space-y-4">
                            <h3 className="text-xs tracking-[0.15em] text-slate-500 font-semibold uppercase">Payment Method</h3>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod("esewa")}
                                className={`relative w-32 rounded-2xl border p-4 text-left transition ${
                                    paymentMethod === "esewa"
                                        ? "border-violet-500 bg-violet-50"
                                        : "border-slate-300 bg-white"
                                }`}
                            >
                                <span className="absolute right-2 top-2 inline-flex h-3 w-3 rounded-full border border-violet-500">
                                    {paymentMethod === "esewa" && <span className="m-auto h-1.5 w-1.5 rounded-full bg-violet-600" />}
                                </span>
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                                    eS
                                </span>
                                <p className="mt-2 text-xs font-semibold text-slate-700">eSewa</p>
                            </button>

                            <div className="rounded-2xl bg-slate-50 px-4 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-600">Service: {selectedType} ({isPrivate ? "Private" : "Group"})</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Total Amount</p>
                                    <p className="text-3xl font-bold text-violet-600 leading-none mt-1">Rs. {totalAmount}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="session-btn-primary w-full rounded-full font-semibold py-3.5 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Processing..." : "Confirm Booking →"}
                            </button>

                            <p className="text-[11px] text-slate-500 text-center">
                                By clicking confirm, you agree to our Terms of Service and Cancellation Policy.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
