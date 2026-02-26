"use client";

import { useEffect, useMemo, useState } from "react";
import { createAdminReview, deleteAdminReview, getAdminContentList, getAdminReviews, type AdminReviewItem, type ContentType, updateAdminReview } from "@/lib/api/admin-content";
import { toast } from "react-toastify";
import { Pencil, Plus, Trash2 } from "lucide-react";

type ItemRef = { id: string; title: string; type: ContentType };
type ReviewRow = {
  id: string;
  contentId: string;
  contentTitle: string;
  type: ContentType;
  rating: number;
  comment?: string;
  userId?: string;
};

export default function AdminReviewsPage() {
  const [content, setContent] = useState<ItemRef[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);

  const [createForm, setCreateForm] = useState({ type: "yoga" as ContentType, contentId: "", rating: 5, comment: "" });
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  const optionsByType = useMemo(() => ({
    yoga: content.filter((c) => c.type === "yoga"),
    meditation: content.filter((c) => c.type === "meditation"),
    mantra: content.filter((c) => c.type === "mantra"),
  }), [content]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [yoga, meditation, mantra] = await Promise.all([
        getAdminContentList("yoga"),
        getAdminContentList("meditation"),
        getAdminContentList("mantra"),
      ]);

      const refs: ItemRef[] = [
        ...yoga.map((i: any) => ({ id: i.id || i._id, title: i.title || "Untitled", type: "yoga" as ContentType })),
        ...meditation.map((i: any) => ({ id: i.id || i._id, title: i.title || "Untitled", type: "meditation" as ContentType })),
        ...mantra.map((i: any) => ({ id: i.id || i._id, title: i.title || "Untitled", type: "mantra" as ContentType })),
      ];
      setContent(refs);

      const reviewResponse = await getAdminReviews();
      const mappedReviews: ReviewRow[] = (reviewResponse as AdminReviewItem[])
        .filter((review) => review.type === "yoga" || review.type === "meditation" || review.type === "mantra")
        .map((review) => ({
          id: review.id,
          contentId: review.content_id,
          contentTitle: review.content_title,
          type: review.type as ContentType,
          rating: review.rating,
          comment: review.comment || "",
          userId: review.user_id,
        }));

      setReviews(mappedReviews);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!createForm.contentId) {
      const first = optionsByType[createForm.type][0];
      if (first) setCreateForm((prev) => ({ ...prev, contentId: first.id }));
    }
  }, [createForm.type, optionsByType, createForm.contentId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminReview(createForm.type, createForm.contentId, {
        rating: createForm.rating,
        comment: createForm.comment,
      });
      toast.success("Review created");
      setOpenCreate(false);
      await loadAll();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create review");
    }
  };

  const startEdit = (review: ReviewRow) => {
    setSelectedReview(review);
    setEditForm({ rating: review.rating, comment: review.comment || "" });
    setOpenEdit(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;
    try {
      await updateAdminReview(selectedReview.type, selectedReview.contentId, selectedReview.id, {
        rating: editForm.rating,
        comment: editForm.comment,
      });
      toast.success("Review updated");
      setOpenEdit(false);
      setSelectedReview(null);
      await loadAll();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update review");
    }
  };

  const handleDelete = async (review: ReviewRow) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteAdminReview(review.type, review.contentId, review.id);
      toast.success("Review deleted");
      await loadAll();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reviews Management</h1>
          <p className="mt-1 text-slate-600">Read, create, update, and delete reviews across content</p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
        >
          <Plus size={16} /> Create Review
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No reviews found</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Content</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Comment</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reviews.map((review) => (
                <tr key={`${review.type}-${review.contentId}-${review.id}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{review.contentTitle}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">{review.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{review.rating}/5</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{review.comment || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={() => startEdit(review)} className="inline-flex items-center gap-1 rounded bg-indigo-100 px-3 py-1 text-indigo-700 hover:bg-indigo-200">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(review)} className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200">
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

      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Create Review</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
              <select
                value={createForm.type}
                onChange={(e) => setCreateForm({ type: e.target.value as ContentType, contentId: "", rating: 5, comment: "" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="yoga">Yoga</option>
                <option value="meditation">Meditation</option>
                <option value="mantra">Mantra</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
              <select
                required
                value={createForm.contentId}
                onChange={(e) => setCreateForm({ ...createForm, contentId: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {optionsByType[createForm.type].map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
              <input type="number" min={1} max={5} required value={createForm.rating} onChange={(e) => setCreateForm({ ...createForm, rating: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Comment</label>
              <textarea rows={3} value={createForm.comment} onChange={(e) => setCreateForm({ ...createForm, comment: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setOpenCreate(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-white">Create</button>
            </div>
          </form>
        </div>
      )}

      {openEdit && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <form onSubmit={handleEdit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Edit Review</h2>
            <p className="text-sm text-slate-500">{selectedReview.contentTitle}</p>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
              <input type="number" min={1} max={5} required value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Comment</label>
              <textarea rows={3} value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setOpenEdit(false); setSelectedReview(null); }} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700">Cancel</button>
              <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-white">Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
