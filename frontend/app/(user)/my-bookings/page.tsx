"use client";

const bookings = [
    {
        id: 1,
        sessionType: "Yoga Practice",
        sessionMode: "Private One-on-One",
        date: "2026-03-02",
        time: "09:30 AM",
        status: "Upcoming",
    },
    {
        id: 2,
        sessionType: "Guided Meditation",
        sessionMode: "Group Session",
        date: "2026-03-05",
        time: "06:00 PM",
        status: "Upcoming",
    },
];

export default function MyBookingsPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                    <p className="text-slate-500 mt-1">Track your upcoming wellness sessions.</p>

                    <div className="mt-6 space-y-4">
                        {bookings.map((booking) => (
                            <article key={booking.id} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{booking.sessionType}</h2>
                                        <p className="text-sm text-slate-600 mt-1">{booking.sessionMode}</p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-violet-100 text-violet-700 px-3 py-1 text-xs font-semibold">
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="mt-3 text-sm text-slate-600">
                                    {booking.date} at {booking.time}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
