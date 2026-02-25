"use client";

import { Fraunces, Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Eye, CheckCircle, Clock } from "lucide-react";
import AnnouncementForm from "./_components/AnnouncementForm";
import { getAllAnnouncements, deleteAnnouncement, publishAnnouncement, Announcement } from "@/lib/api/announcements";

const display = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700"] });
const body = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("");

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await getAllAnnouncements(page, 10, statusFilter || undefined);
            setAnnouncements(response.data || []);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error: any) {
            toast.error(error.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [page, statusFilter]);

    const handleEdit = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        try {
            await deleteAnnouncement(id);
            toast.success("Announcement deleted successfully");
            fetchAnnouncements();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete announcement");
        }
    };

    const handlePublish = async (id: string) => {
        try {
            await publishAnnouncement(id);
            toast.success("Announcement published successfully");
            fetchAnnouncements();
        } catch (error: any) {
            toast.error(error.message || "Failed to publish announcement");
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingAnnouncement(null);
    };

    const handleFormSuccess = () => {
        setPage(1);
        fetchAnnouncements();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle className="w-3 h-3" /> Published</span>;
            case 'scheduled':
                return <span className="flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"><Clock className="w-3 h-3" /> Scheduled</span>;
            default:
                return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Draft</span>;
        }
    };

    return (
        <div className={`${body.className} space-y-10`}>
            {/* Header */}
            <section className="rounded-[28px] border border-slate-200 bg-linear-to-br from-amber-50 via-white to-sky-100 p-8 shadow-sm">
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
                    <button
                        onClick={() => {
                            setEditingAnnouncement(null);
                            setShowForm(true);
                        }}
                        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                    >
                        Create announcement
                    </button>
                </div>
            </section>

            {/* Filters and Stats */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setStatusFilter("")}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                            statusFilter === ""
                                ? "bg-slate-900 text-white"
                                : "border border-slate-300 text-slate-700 hover:border-slate-400"
                        }`}
                    >
                        All ({announcements.length})
                    </button>
                    {['draft', 'scheduled', 'published'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                statusFilter === status
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-300 text-slate-700 hover:border-slate-400"
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Announcements List */}
            <section className="space-y-4">
                <h2 className={`${display.className} text-2xl font-semibold text-slate-900`}>
                    {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Announcements` : "All Announcements"}
                </h2>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600">Loading announcements...</p>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <p className="text-slate-600 mb-4">No announcements yet</p>
                        <button
                            onClick={() => {
                                setEditingAnnouncement(null);
                                setShowForm(true);
                            }}
                            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                            Create your first announcement
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <article
                                key={announcement.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900">{announcement.title}</h3>
                                            {getStatusBadge(announcement.status)}
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2">{announcement.message}</p>
                                        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                                            <span>Tone: <span className="capitalize font-semibold">{announcement.tone}</span></span>
                                            <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                                            {announcement.scheduled_at && (
                                                <span>Scheduled: {new Date(announcement.scheduled_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {announcement.status !== 'published' && (
                                            <button
                                                onClick={() => handleEdit(announcement)}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        {announcement.status !== 'published' && (
                                            <button
                                                onClick={() => handlePublish(announcement.id)}
                                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                                title="Publish"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(announcement.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                    page === p
                                        ? "bg-slate-900 text-white"
                                        : "border border-slate-300 text-slate-700 hover:border-slate-400"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Form Modal */}
            {showForm && (
                <AnnouncementForm
                    announcement={editingAnnouncement}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}
