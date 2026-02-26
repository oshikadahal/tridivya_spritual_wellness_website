"use client";

import { useEffect, useState } from "react";
import { BookingResponse, CreateBookingData, PaymentMethodEnum, SessionModeEnum, SessionTypeEnum } from "@/lib/api/booking";
import { createBookingAdmin, deleteBookingAdmin, getAllBookingsAdmin, updateBookingAdmin, updateBookingStatusAdmin } from "@/lib/api/admin";
import { toast } from "react-toastify";
import { Pencil, Plus, Trash2, X } from "lucide-react";

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

const sessionModes: SessionModeEnum[] = ["private", "group"];
const paymentMethods: PaymentMethodEnum[] = ["esewa", "khalti", "cash"];

const defaultFormState: CreateBookingData = {
  session_type: "Yoga Practice",
  session_mode: "private",
  booking_date: "",
  time_slot: "",
  full_name: "",
  email: "",
  phone: "",
  special_request: "",
  payment_method: "cash",
  amount: 0,
  duration_minutes: 60,
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateBookingData>(defaultFormState);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsAdmin();
      setBookings(response?.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (booking: BookingResponse) => {
    setEditingId(booking.id);
    setFormData({
      session_type: booking.session_type,
      session_mode: booking.session_mode,
      booking_date: booking.booking_date?.slice(0, 10) || "",
      time_slot: booking.time_slot,
      full_name: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      special_request: booking.special_request || "",
      payment_method: booking.payment_method,
      amount: booking.amount,
      duration_minutes: booking.duration_minutes,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(defaultFormState);
  };

  const handleFormSubmit = async () => {
    if (!formData.booking_date || !formData.time_slot || !formData.full_name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      const payload: CreateBookingData = {
        ...formData,
        amount: Number(formData.amount),
        duration_minutes: Number(formData.duration_minutes || 60),
      };

      if (editingId) {
        await updateBookingAdmin(editingId, payload);
        toast.success("Booking updated successfully");
      } else {
        await createBookingAdmin(payload);
        toast.success("Booking created successfully");
      }

      closeModal();
      await loadBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: "upcoming" | "completed" | "cancelled") => {
    try {
      setUpdating(id);
      await updateBookingStatusAdmin(id, status);
      toast.success("Booking status updated");
      await loadBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteBookingAdmin(id);
      toast.success("Booking deleted");
      await loadBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete booking");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bookings Management</h1>
        <p className="mt-1 text-slate-600">View, update, and delete booking records</p>
        <button
          onClick={openCreateModal}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={16} /> Create Booking
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No bookings found</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Session</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{booking.full_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{booking.session_type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">NPR {booking.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        booking.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : booking.status === "cancelled"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <select
                        disabled={updating === booking.id}
                        defaultValue={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as "upcoming" | "completed" | "cancelled")}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        <option value="upcoming">upcoming</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                      <button
                        onClick={() => openEditModal(booking)}
                        className="inline-flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{editingId ? "Edit Booking" : "Create Booking"}</h2>
              <button onClick={closeModal} className="rounded p-1 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                <input value={formData.full_name} onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Session Type</label>
                <select value={formData.session_type} onChange={(e) => setFormData((prev) => ({ ...prev, session_type: e.target.value as SessionTypeEnum }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900">
                  {sessionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Session Mode</label>
                <select value={formData.session_mode} onChange={(e) => setFormData((prev) => ({ ...prev, session_mode: e.target.value as SessionModeEnum }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900">
                  {sessionModes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Booking Date</label>
                <input type="date" value={formData.booking_date} onChange={(e) => setFormData((prev) => ({ ...prev, booking_date: e.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Time Slot</label>
                <input value={formData.time_slot} onChange={(e) => setFormData((prev) => ({ ...prev, time_slot: e.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" placeholder="e.g. 10:00 AM - 11:00 AM" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
                <select value={formData.payment_method} onChange={(e) => setFormData((prev) => ({ ...prev, payment_method: e.target.value as PaymentMethodEnum }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900">
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
                <input type="number" min={0} value={formData.amount} onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Duration (minutes)</label>
                <input type="number" min={30} value={formData.duration_minutes || 60} onChange={(e) => setFormData((prev) => ({ ...prev, duration_minutes: Number(e.target.value) }))} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Special Request</label>
                <textarea value={formData.special_request || ""} onChange={(e) => setFormData((prev) => ({ ...prev, special_request: e.target.value }))} rows={3} className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
              <button onClick={handleFormSubmit} disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update Booking" : "Create Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
