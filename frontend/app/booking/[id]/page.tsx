"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBookingById, BookingResponse } from "@/lib/api/booking";
import { toast } from "react-toastify";

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBookingById(id)
      .then(setBooking)
      .catch(() => {
        toast.error("Failed to load booking details.");
        router.push("/my-bookings");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="p-8 text-center">Loading booking details...</div>;
  if (!booking) return <div className="p-8 text-center text-red-500">Booking not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <div className="space-y-2">
        <div><b>Session Type:</b> {booking.session_type}</div>
        <div><b>Session Mode:</b> {booking.session_mode}</div>
        <div><b>Date:</b> {new Date(booking.booking_date).toLocaleDateString()}</div>
        <div><b>Time Slot:</b> {booking.time_slot}</div>
        <div><b>Full Name:</b> {booking.full_name}</div>
        <div><b>Email:</b> {booking.email}</div>
        <div><b>Phone:</b> {booking.phone}</div>
        {booking.special_request && <div><b>Special Request:</b> {booking.special_request}</div>}
        <div><b>Payment Method:</b> {booking.payment_method}</div>
        <div><b>Payment Status:</b> {booking.payment_status}</div>
        <div><b>Amount:</b> Rs. {booking.amount}</div>
        <div><b>Status:</b> {booking.status}</div>
        {booking.instructor && <div><b>Instructor:</b> {booking.instructor}</div>}
        <div><b>Duration:</b> {booking.duration_minutes} min</div>
      </div>
      <button
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={() => router.push("/my-bookings")}
      >
        Back to My Bookings
      </button>
    </div>
  );
}
