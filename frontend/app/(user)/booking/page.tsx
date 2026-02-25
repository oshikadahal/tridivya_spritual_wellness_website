"use client";

import { useState } from "react";

const sessionTypes = [
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
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedType, setSelectedType] = useState(sessionTypes[0]);
    const [selectedSlot, setSelectedSlot] = useState("09:30 AM");
    const [isPrivate, setIsPrivate] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("esewa");

    const totalAmount = isPrivate ? 1500 : 1000;
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDate = today.toISOString().split("T")[0];

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
                                    onChange={(event) => setSelectedType(event.target.value)}
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
                                className="w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 shadow-lg transition"
                            >
                                Confirm Booking →
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
