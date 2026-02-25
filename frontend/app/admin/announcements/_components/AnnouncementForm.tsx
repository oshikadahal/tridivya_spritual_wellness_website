"use client";

import { useState } from "react";
import { useState as useStateForm } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { createAnnouncement, updateAnnouncement, Announcement } from "@/lib/api/announcements";

interface AnnouncementFormProps {
    announcement?: Announcement | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AnnouncementForm({ announcement, onClose, onSuccess }: AnnouncementFormProps) {
    const [title, setTitle] = useState(announcement?.title || "");
    const [message, setMessage] = useState(announcement?.message || "");
    const [tone, setTone] = useState<'calm' | 'empower' | 'celebrate'>(
        (announcement?.tone as any) || "calm"
    );
    const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>(
        (announcement?.status as any) || "draft"
    );
    const [scheduledAt, setScheduledAt] = useState(
        announcement?.scheduled_at ? new Date(announcement.scheduled_at).toISOString().split('T')[0] : ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (!message.trim()) {
            toast.error("Message is required");
            return;
        }

        try {
            setIsSubmitting(true);

            const formData: any = {
                title: title.trim(),
                message: message.trim(),
                tone,
                status,
            };

            if (scheduledAt) {
                formData.scheduled_at = new Date(scheduledAt);
            }

            if (announcement?.id) {
                await updateAnnouncement(announcement.id, formData);
                toast.success("Announcement updated successfully");
            } else {
                await createAnnouncement(formData);
                toast.success("Announcement created successfully");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to save announcement");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {announcement ? "Edit Announcement" : "Create Announcement"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Morning Mantra Drop"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                            maxLength={200}
                        />
                        <p className="text-xs text-slate-500 mt-1">{title.length}/200</p>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share the intention behind the new series or announcement."
                            rows={5}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        />
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Tone <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {['calm', 'empower', 'celebrate'].map((toneOption) => (
                                <button
                                    key={toneOption}
                                    type="button"
                                    onClick={() => setTone(toneOption as any)}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                                        tone === toneOption
                                            ? 'bg-slate-900 text-white'
                                            : 'border border-slate-300 text-slate-700 hover:border-slate-400'
                                    }`}
                                >
                                    {toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    {/* Scheduled At */}
                    {status === 'scheduled' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Schedule For <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : announcement ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
