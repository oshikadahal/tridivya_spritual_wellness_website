import axios from "./axios";
import { API } from "./endpoints";
import type { ContentItem, ReviewItem } from "./content";

export type ContentType = "yoga" | "meditation" | "mantra" | "library";

export interface AdminContentPayload {
  title: string;
  subtitle?: string;
  description: string;
  image_url: string;
  thumbnail_url?: string;
  media_url?: string;
  audio_url?: string;
  cover_image_url?: string;
  duration_seconds?: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal_slug: string;
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
  is_featured?: boolean;
  is_trending?: boolean;
  is_active?: boolean;
}

const getBasePath = (type: ContentType) => {
  if (type === "yoga") return API.YOGAS;
  if (type === "meditation") return API.MEDITATIONS;
  if (type === "library") return API.LIBRARY;
  return API.MANTRAS;
};

const parseList = (data: any): ContentItem[] => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

export const getAdminContentList = async (type: ContentType): Promise<ContentItem[]> => {
  const base = getBasePath(type);
  const response = await axios.get(base.LIST, { params: { limit: 100, page: 1, is_active: true } });
  return parseList(response.data);
};

export const createAdminContent = async (type: ContentType, payload: AdminContentPayload) => {
  const base = getBasePath(type);
  try {
    const response = await axios.post(base.LIST, payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to create content";
    throw new Error(message);
  }
};

export const updateAdminContent = async (type: ContentType, id: string, payload: Partial<AdminContentPayload>) => {
  const base = getBasePath(type);
  try {
    const response = await axios.patch(base.BY_ID(id), payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update content";
    throw new Error(message);
  }
};

export const deleteAdminContent = async (type: ContentType, id: string) => {
  const base = getBasePath(type);
  const response = await axios.delete(base.BY_ID(id));
  return response.data;
};

export const uploadAdminVideo = async (videoFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    const response = await axios.post(API.ADMIN.UPLOAD_VIDEO, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data?.url || "";
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to upload video";
    throw new Error(message);
  }
};

export const uploadAdminAudio = async (audioFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  try {
    const response = await axios.post(API.ADMIN.UPLOAD_AUDIO, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data?.url || "";
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to upload audio";
    throw new Error(message);
  }
};

export const uploadAdminImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(API.ADMIN.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data?.url || "";
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to upload image";
    throw new Error(message);
  }
};

export const uploadAdminLibraryContent = async (contentFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("content_file", contentFile);

  try {
    const response = await axios.post(API.LIBRARY.UPLOAD_CONTENT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data?.content_url || "";
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to upload document";
    throw new Error(message);
  }
};

const getReviewsPath = (type: ContentType, contentId: string) => {
  if (type === "yoga") return API.YOGAS.REVIEWS(contentId);
  if (type === "meditation") return API.MEDITATIONS.REVIEWS(contentId);
  return API.MANTRAS.REVIEWS(contentId);
};

const getReviewDeletePath = (type: ContentType, contentId: string, reviewId: string) => {
  if (type === "yoga") return `${API.YOGAS.REVIEWS(contentId)}/${reviewId}`;
  if (type === "meditation") return `${API.MEDITATIONS.REVIEWS(contentId)}/${reviewId}`;
  return `${API.MANTRAS.REVIEWS(contentId)}/${reviewId}`;
};

const parseReviews = (responseData: any): ReviewItem[] => {
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData)) return responseData;
  return [];
};

export const getContentReviews = async (type: ContentType, contentId: string): Promise<ReviewItem[]> => {
  const response = await axios.get(getReviewsPath(type, contentId));
  return parseReviews(response.data);
};

export type AdminReviewItem = {
  id: string;
  type: ContentType | "library";
  content_id: string;
  content_title: string;
  rating: number;
  comment?: string;
  user_id?: string;
  created_at?: string;
};

export const getAdminReviews = async (): Promise<AdminReviewItem[]> => {
  const response = await axios.get(API.ADMIN.REVIEWS);
  return response.data?.data || [];
};

export const createAdminReview = async (
  type: ContentType,
  contentId: string,
  payload: { rating: number; comment?: string }
) => {
  const response = await axios.post(API.ADMIN.REVIEW_CREATE(type, contentId), payload);
  return response.data;
};

export const updateAdminReview = async (
  type: ContentType,
  contentId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const response = await axios.patch(API.ADMIN.REVIEW_BY_ID(type, contentId, reviewId), payload);
  return response.data;
};

export const deleteAdminReview = async (
  type: ContentType,
  contentId: string,
  reviewId: string
) => {
  const response = await axios.delete(API.ADMIN.REVIEW_BY_ID(type, contentId, reviewId));
  return response.data;
};

export const createContentReview = async (
  type: ContentType,
  contentId: string,
  payload: { rating: number; comment?: string }
) => {
  const response = await axios.post(getReviewsPath(type, contentId), payload);
  return response.data;
};

export const updateContentReview = async (
  type: ContentType,
  contentId: string,
  reviewId: string,
  payload: { rating?: number; comment?: string }
) => {
  const response = await axios.patch(getReviewDeletePath(type, contentId, reviewId), payload);
  return response.data;
};

export const deleteContentReview = async (type: ContentType, contentId: string, reviewId: string) => {
  const response = await axios.delete(getReviewDeletePath(type, contentId, reviewId));
  return response.data;
};
