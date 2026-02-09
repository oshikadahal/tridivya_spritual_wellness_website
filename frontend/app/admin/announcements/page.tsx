"use client";

import { Fraunces, Space_Grotesk } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"] });
const body = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"] });

const ANNOUNCEMENTS = [
    {
        title: "New Moon Breathwork",
        detail: "A 30-minute guided session drops Friday at 6 PM. Invite your community to join.",
        tag: "Scheduled",
        date: "Feb 12, 2026",
    },
    {
        title: "Weekly Intention Circle",
        detail: "Collect intentions from users and weave them into the Monday mantra.",
        tag: "Draft",
        date: "Feb 10, 2026",
    },
    {
        title: "Teacher Spotlight: Asha",
        detail: "Celebrate Asha's 100th class with a featured banner on the public landing page.",
        tag: "Published",
        date: "Feb 8, 2026",
    },
];

export default function AnnouncementsPage() {
    return (
        <div className={`${body.className} space-y-10`}>
            <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-sky-100 p-8 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Community Broadcasts
                        </p>
                        <h1 className={`${display.className} mt-3 text-4xl font-semibold text-slate-900`}>
                            Announcements Studio
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm text-slate-600">
                            Shape the energy of the platform with curated updates, reminders, and
                            weekly rituals. Plan, preview, and schedule messages in one place.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm">
                            Create announcement
                        </button>
                        <button className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700">
                            View calendar
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className={`${display.className} text-2xl font-semibold text-slate-900`}>
                            Upcoming & Drafts
                        </h2>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            3 queued
                        </span>
                    </div>
                    <div className="space-y-4">
                        {ANNOUNCEMENTS.map((item) => (
                            <article
                                key={item.title}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            item.tag === "Published"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : item.tag === "Scheduled"
                                                ? "bg-sky-100 text-sky-700"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        {item.tag}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                    <span>{item.date}</span>
                                    <button className="font-semibold text-slate-700">Edit</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className={`${display.className} text-xl font-semibold text-slate-900`}>
                        Quick Compose
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Draft a message, pick a tone, and hand it off to scheduling.
                    </p>
                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Title
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                                placeholder="Morning Mantra Drop"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Message
                            </label>
                            <textarea
                                className="mt-2 h-32 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                                placeholder="Share the intention behind the new series."
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Calm', 'Empower', 'Celebrate'].map((tone) => (
                                <button
                                    key={tone}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>
                        <button className="w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                            Save draft
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
