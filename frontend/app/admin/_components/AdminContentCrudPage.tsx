"use client";

import { useEffect, useMemo, useState } from "react";
import { createAdminContent, deleteAdminContent, type AdminContentPayload, getAdminContentList, type ContentType, updateAdminContent, uploadAdminAudio, uploadAdminImage, uploadAdminLibraryContent, uploadAdminVideo } from "@/lib/api/admin-content";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

type ContentItem = {
  id?: string;
  _id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  duration_seconds?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  goal_slug?: string;
  is_active?: boolean;
  image_url?: string;
  thumbnail_url?: string;
  media_url?: string;
  audio_url?: string;
  cover_image_url?: string;
  meaning?: string;
  lyrics?: string;
  transliteration?: string;
  pronunciation_guide?: string;
  library_type?: "book" | "article" | "resource";
  author_name?: string;
  content_text?: string;
  read_minutes?: number;
  content_url?: string;
  category_slug?: string;
};

const defaultPayload: AdminContentPayload = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  thumbnail_url: undefined,
  media_url: "",
  audio_url: "",
  cover_image_url: undefined,
  duration_seconds: 600,
  difficulty: "beginner",
  goal_slug: "wellness",
  meaning: "",
  lyrics: "",
  transliteration: "",
  pronunciation_guide: "",
  library_type: "resource",
  author_name: "",
  content_text: "",
  read_minutes: 10,
  content_url: "",
  category_slug: "meditation",
  is_active: true,
  is_featured: false,
  is_trending: false,
};

const libraryCategoryOptions = ["meditation", "mantra", "yoga"] as const;

const getItemId = (item: ContentItem) => item.id || item._id || "";

export default function AdminContentCrudPage({
  type,
  title,
  subtitle,
}: {
  type: ContentType;
  title: string;
  subtitle: string;
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminContentPayload>(defaultPayload);

  const isMantra = type === "mantra";
  const isLibrary = type === "library";

  const formTitle = useMemo(() => (editingId ? `Edit ${title.slice(0, -1)}` : `Create ${title.slice(0, -1)}`), [editingId, title]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getAdminContentList(type);
      setItems(data as ContentItem[]);
    } catch (error: any) {
      toast.error(error?.message || `Failed to fetch ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [type]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultPayload);
    setOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditingId(getItemId(item));
    setForm({
      ...defaultPayload,
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      image_url: item.image_url || "",
      thumbnail_url: item.thumbnail_url || item.image_url || "",
      media_url: item.media_url || "",
      audio_url: item.audio_url || "",
      cover_image_url: item.cover_image_url || "",
      duration_seconds: item.duration_seconds || 600,
      difficulty: item.difficulty || "beginner",
      goal_slug: item.goal_slug || "wellness",
      is_active: item.is_active ?? true,
      meaning: item.meaning || "",
      lyrics: item.lyrics || "",
      transliteration: item.transliteration || "",
      pronunciation_guide: item.pronunciation_guide || "",
      library_type: item.library_type || "resource",
      author_name: item.author_name || "",
      content_text: item.content_text || "",
      read_minutes: item.read_minutes || 10,
      content_url: item.content_url || "",
      category_slug: item.category_slug || "meditation",
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingId(null);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const basePayload: AdminContentPayload = {
        title: form.title,
        subtitle: form.subtitle?.trim() || undefined,
        description: form.description,
        image_url: form.image_url,
        thumbnail_url: form.image_url,
        difficulty: form.difficulty,
        goal_slug: form.goal_slug,
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_trending: form.is_trending,
      };

      const payload: AdminContentPayload = isMantra
        ? {
            ...basePayload,
            audio_url: form.audio_url?.trim() || undefined,
          duration_seconds: form.duration_seconds,
            cover_image_url: form.cover_image_url?.trim() || form.image_url,
            meaning: form.meaning?.trim() || undefined,
            lyrics: form.lyrics?.trim() || undefined,
            transliteration: form.transliteration?.trim() || undefined,
            pronunciation_guide: form.pronunciation_guide?.trim() || undefined,
          }
        : isLibrary
        ? {
            title: form.title,
            description: form.description?.trim() || undefined,
            cover_image_url: form.cover_image_url?.trim() || form.image_url?.trim() || undefined,
            thumbnail_url: form.image_url?.trim() || undefined,
            content_url: form.content_url?.trim() || undefined,
            library_type: "resource",
            author_name: form.author_name?.trim() || undefined,
            content_text: form.content_text?.trim() || undefined,
            read_minutes: form.read_minutes,
            category_slug: (form.category_slug || "meditation").trim().toLowerCase(),
            is_active: form.is_active,
            is_featured: form.is_featured,
          }
        : {
            ...basePayload,
            media_url: form.media_url?.trim() || undefined,
            duration_seconds: form.duration_seconds,
          };

      if (editingId) {
        await updateAdminContent(type, editingId, payload);
        toast.success(`${title.slice(0, -1)} updated`);
      } else {
        await createAdminContent(type, payload);
        toast.success(`${title.slice(0, -1)} created`);
      }
      closeModal();
      await loadItems();
    } catch (error: any) {
      toast.error(error?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteAdminContent(type, id);
      toast.success(`${title.slice(0, -1)} deleted`);
      await loadItems();
    } catch (error: any) {
      toast.error(error?.message || "Delete failed");
    }
  };

  const handleVideoUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      setUploadingVideo(true);
      const mediaPath = await uploadAdminVideo(file);
      if (!mediaPath) {
        toast.error("Video upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, media_url: mediaPath }));
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleImageUpload = async (file: File | undefined, field: "image_url" | "cover_image_url" = "image_url") => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const imageUrl = await uploadAdminImage(file);
      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, [field]: imageUrl }));
      setForm((prev) => {
        if (field === "image_url") {
          return {
            ...prev,
            image_url: imageUrl,
            thumbnail_url: imageUrl,
            ...(type === "mantra" && !prev.cover_image_url ? { cover_image_url: imageUrl } : {}),
          };
        }

        return { ...prev, [field]: imageUrl };
      });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      setUploadingAudio(true);
      const audioUrl = await uploadAdminAudio(file);
      if (!audioUrl) {
        toast.error("Audio upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, audio_url: audioUrl }));
      toast.success("Audio uploaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload audio");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleDocumentUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      setUploadingDocument(true);
      const contentUrl = await uploadAdminLibraryContent(file);
      if (!contentUrl) {
        toast.error("Document upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, content_url: contentUrl }));
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload document");
    } finally {
      setUploadingDocument(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-slate-600">{subtitle}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
        >
          <Plus size={16} /> Create
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No records found</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-600">Goal</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => {
                const id = getItemId(item);
                return (
                  <tr key={id || item.title} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{item.title || "Untitled"}</p>
                      <p className="text-xs text-slate-500">{item.subtitle || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.difficulty || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.duration_seconds ? `${Math.round(item.duration_seconds / 60)} min` : "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.goal_slug || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center gap-1 rounded bg-indigo-100 px-3 py-1 text-indigo-700 hover:bg-indigo-200"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => onDelete(id)}
                          className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{formTitle}</h2>
              <button onClick={closeModal} className="rounded p-1 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Subtitle</label>
                <input value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea required={!isLibrary} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" rows={3} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Image URL</label>
                <input required={!isLibrary} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                <div className="mt-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0], "image_url")}
                    />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
              </div>
              {!isLibrary && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Goal Slug</label>
                  <input
                    required
                    value={form.goal_slug}
                    onChange={(e) => setForm({ ...form, goal_slug: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400"
                  />
                </div>
              )}

              {isLibrary ? (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Library Type</label>
                    <select value={form.category_slug || "meditation"} onChange={(e) => setForm({ ...form, category_slug: e.target.value as "meditation" | "mantra" | "yoga" })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">
                      {libraryCategoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Author Name</label>
                    <input value={form.author_name || ""} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Content URL (PDF)</label>
                    <input value={form.content_url || ""} onChange={(e) => setForm({ ...form, content_url: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                    <div className="mt-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload(e.target.files?.[0])}
                        />
                        {uploadingDocument ? "Uploading..." : "Upload PDF"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Read Minutes</label>
                    <input type="number" min={0} value={form.read_minutes || 0} onChange={(e) => setForm({ ...form, read_minutes: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Content Text</label>
                    <textarea value={form.content_text || ""} onChange={(e) => setForm({ ...form, content_text: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" rows={3} />
                  </div>
                </>
              ) : !isMantra ? (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Media URL</label>
                    <input required value={form.media_url || ""} onChange={(e) => setForm({ ...form, media_url: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                    <div className="mt-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleVideoUpload(e.target.files?.[0])}
                        />
                        {uploadingVideo ? "Uploading..." : "Upload Video"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Duration (seconds)</label>
                    <input type="number" min={0} required value={form.duration_seconds || 0} onChange={(e) => setForm({ ...form, duration_seconds: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Audio URL</label>
                    <input required value={form.audio_url || ""} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                    <div className="mt-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => handleAudioUpload(e.target.files?.[0])}
                        />
                        {uploadingAudio ? "Uploading..." : "Upload Audio"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Cover Image URL</label>
                    <input value={form.cover_image_url || ""} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                    <div className="mt-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files?.[0], "cover_image_url")}
                        />
                        {uploadingImage ? "Uploading..." : "Upload Cover"}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Duration (seconds)</label>
                    <input type="number" min={0} required value={form.duration_seconds || 0} onChange={(e) => setForm({ ...form, duration_seconds: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Meaning</label>
                    <textarea required value={form.meaning || ""} onChange={(e) => setForm({ ...form, meaning: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">Lyrics</label>
                    <textarea required value={form.lyrics || ""} onChange={(e) => setForm({ ...form, lyrics: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" rows={2} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Transliteration</label>
                    <input value={form.transliteration || ""} onChange={(e) => setForm({ ...form, transliteration: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Pronunciation Guide</label>
                    <input value={form.pronunciation_guide || ""} onChange={(e) => setForm({ ...form, pronunciation_guide: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400" />
                  </div>
                </>
              )}

              {!isLibrary && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as AdminContentPayload["difficulty"] })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              )}

              <div className="flex items-end gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured
                </label>
                {!isLibrary && <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={!!form.is_trending} onChange={(e) => setForm({ ...form, is_trending: e.target.checked })} /> Trending
                </label>}
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
                </label>
              </div>

              <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
                <button type="button" onClick={closeModal} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600 disabled:opacity-60">
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
