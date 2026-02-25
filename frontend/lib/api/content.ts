import axios from "./axios";
import { API } from "./endpoints";

type Difficulty = "beginner" | "intermediate" | "advanced";

export type ContentItem = {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    image_url?: string;
    thumbnail_url?: string;
    media_url?: string;
    audio_url?: string;
    cover_image_url?: string;
    duration_seconds?: number;
    difficulty?: Difficulty;
    goal_slug?: string;
    is_featured?: boolean;
    is_trending?: boolean;
    is_active?: boolean;
    meaning?: string;
    lyrics?: string;
    transliteration?: string;
    author_name?: string;
    library_type?: "book" | "article" | "resource";
    read_minutes?: number;
    category_slug?: string;
};

export type SavedSession = {
    content_type: "meditation" | "yoga" | "mantra" | "library";
    content_id: string;
    title: string;
    subtitle?: string | null;
    duration_seconds?: number;
    thumbnail_url?: string | null;
    saved_at?: string | null;
};

export type ProgressItem = {
    id?: string;
    meditation_id?: string;
    yoga_id?: string;
    mantra_id?: string;
    library_item_id?: string;
    progress_percent?: number;
    last_position_seconds?: number;
    status?: "not_started" | "in_progress" | "completed";
    times_practiced?: number;
};

export type ReviewItem = {
    id?: string;
    user_id?: string;
    rating: number;
    comment?: string;
    created_at?: string;
    updated_at?: string;
};

type ListParams = Record<string, string | number | boolean | undefined>;

const getClientAuthToken = () => {
    if (typeof document === "undefined") return null;
    const cookieName = "auth_token=";
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(cookieName)) {
            return trimmedCookie.substring(cookieName.length);
        }
    }
    return null;
};

const getAuthHeaders = () => {
    const token = getClientAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const toErrorMessage = (err: Error | any, fallback: string) => (
    err?.response?.data?.message
    || err?.message
    || fallback
);

const buildQuery = (params?: ListParams) => {
    if (!params) return undefined;

    return Object.entries(params).reduce<Record<string, string | number | boolean>>((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            acc[key] = value;
        }
        return acc;
    }, {});
};

const parseListResponse = (responseData: any): { data: ContentItem[]; total: number; page: number; limit: number } => {
    if (responseData?.success && Array.isArray(responseData?.data)) {
        return {
            data: responseData.data,
            total: responseData.pagination?.total ?? responseData.data.length,
            page: responseData.pagination?.page ?? 1,
            limit: responseData.pagination?.limit ?? responseData.data.length,
        };
    }

    return {
        data: responseData?.data ?? [],
        total: responseData?.total ?? 0,
        page: responseData?.page ?? 1,
        limit: responseData?.limit ?? 10,
    };
};

export const listMeditations = async (params?: ListParams) => {
    try {
        const response = await axios.get(API.MEDITATIONS.LIST, {
            params: buildQuery(params),
            headers: { ...getAuthHeaders() },
        });
        return parseListResponse(response.data);
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch meditations"));
    }
};

export const listYogas = async (params?: ListParams) => {
    try {
        const response = await axios.get(API.YOGAS.LIST, {
            params: buildQuery(params),
            headers: { ...getAuthHeaders() },
        });
        return parseListResponse(response.data);
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch yoga programs"));
    }
};

export const listMantras = async (params?: ListParams) => {
    try {
        const response = await axios.get(API.MANTRAS.LIST, {
            params: buildQuery(params),
            headers: { ...getAuthHeaders() },
        });
        return parseListResponse(response.data);
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch mantras"));
    }
};

export const listLibraryItems = async (params?: ListParams) => {
    try {
        const response = await axios.get(API.LIBRARY.LIST, {
            params: buildQuery(params),
            headers: { ...getAuthHeaders() },
        });
        return parseListResponse(response.data);
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch library items"));
    }
};

export const getMeditationById = async (id: string): Promise<ContentItem> => {
    try {
        const response = await axios.get(API.MEDITATIONS.BY_ID(id), {
            headers: { ...getAuthHeaders() },
        });
        return response.data?.data ?? response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch meditation details"));
    }
};

export const getYogaById = async (id: string): Promise<ContentItem> => {
    try {
        const response = await axios.get(API.YOGAS.BY_ID(id), {
            headers: { ...getAuthHeaders() },
        });
        return response.data?.data ?? response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch yoga details"));
    }
};

export const getMantraById = async (id: string): Promise<ContentItem> => {
    try {
        const response = await axios.get(API.MANTRAS.BY_ID(id), {
            headers: { ...getAuthHeaders() },
        });
        return response.data?.data ?? response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch mantra details"));
    }
};

export const getLibraryItemById = async (id: string): Promise<ContentItem> => {
    try {
        const response = await axios.get(API.LIBRARY.BY_ID(id), {
            headers: { ...getAuthHeaders() },
        });
        return response.data?.data ?? response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch library details"));
    }
};

export const getSavedSessions = async (contentType?: SavedSession["content_type"]): Promise<SavedSession[]> => {
    try {
        const response = await axios.get(API.ME.SAVED_SESSIONS, {
            params: buildQuery({ content_type: contentType }),
            headers: { ...getAuthHeaders() },
        });
        return response.data ?? [];
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch saved sessions"));
    }
};

export const getSavedMeditationIds = async (): Promise<string[]> => {
    try {
        const response = await axios.get(API.ME.SAVED_MEDITATIONS, { headers: { ...getAuthHeaders() } });
        return response.data ?? [];
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch saved meditations"));
    }
};

export const getSavedYogaIds = async (): Promise<string[]> => {
    try {
        const response = await axios.get(API.ME.SAVED_YOGAS, { headers: { ...getAuthHeaders() } });
        return response.data ?? [];
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch saved yogas"));
    }
};

export const getSavedMantraIds = async (): Promise<string[]> => {
    try {
        const response = await axios.get(API.ME.SAVED_MANTRAS, { headers: { ...getAuthHeaders() } });
        return response.data ?? [];
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch saved mantras"));
    }
};

export const getSavedLibraryIds = async (): Promise<string[]> => {
    try {
        const response = await axios.get(API.ME.SAVED_LIBRARY, { headers: { ...getAuthHeaders() } });
        return response.data ?? [];
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch saved library"));
    }
};

export const saveMeditation = async (meditationId: string) => {
    return axios.post(API.ME.SAVED_MEDITATIONS, { meditation_id: meditationId }, { headers: { ...getAuthHeaders() } });
};

export const unsaveMeditation = async (meditationId: string) => {
    return axios.delete(`${API.ME.SAVED_MEDITATIONS}/${meditationId}`, { headers: { ...getAuthHeaders() } });
};

export const saveYoga = async (yogaId: string) => {
    return axios.post(API.ME.SAVED_YOGAS, { yoga_id: yogaId }, { headers: { ...getAuthHeaders() } });
};

export const unsaveYoga = async (yogaId: string) => {
    return axios.delete(`${API.ME.SAVED_YOGAS}/${yogaId}`, { headers: { ...getAuthHeaders() } });
};

export const saveMantra = async (mantraId: string) => {
    return axios.post(API.ME.SAVED_MANTRAS, { mantra_id: mantraId }, { headers: { ...getAuthHeaders() } });
};

export const unsaveMantra = async (mantraId: string) => {
    return axios.delete(`${API.ME.SAVED_MANTRAS}/${mantraId}`, { headers: { ...getAuthHeaders() } });
};

export const saveLibraryItem = async (libraryItemId: string) => {
    return axios.post(API.ME.SAVED_LIBRARY, { library_item_id: libraryItemId }, { headers: { ...getAuthHeaders() } });
};

export const unsaveLibraryItem = async (libraryItemId: string) => {
    return axios.delete(`${API.ME.SAVED_LIBRARY}/${libraryItemId}`, { headers: { ...getAuthHeaders() } });
};

export const getMeditationProgress = async (): Promise<ProgressItem[]> => {
    const response = await axios.get(API.ME.MEDITATION_PROGRESS, { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const getYogaProgress = async (): Promise<ProgressItem[]> => {
    const response = await axios.get(API.ME.YOGA_PROGRESS, { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const getMantraProgress = async (): Promise<ProgressItem[]> => {
    const response = await axios.get(API.ME.MANTRA_PROGRESS, { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const getLibraryProgress = async (): Promise<ProgressItem[]> => {
    const response = await axios.get(API.ME.LIBRARY_PROGRESS, { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const upsertMeditationProgress = async (payload: {
    meditation_id: string;
    progress_percent: number;
    last_position_seconds: number;
    status?: "not_started" | "in_progress" | "completed";
}) => {
    const response = await axios.post(API.ME.MEDITATION_PROGRESS, payload, { headers: { ...getAuthHeaders() } });
    return response.data;
};

export const upsertYogaProgress = async (payload: {
    yoga_id: string;
    progress_percent: number;
    last_position_seconds: number;
    status?: "not_started" | "in_progress" | "completed";
}) => {
    const response = await axios.post(API.ME.YOGA_PROGRESS, payload, { headers: { ...getAuthHeaders() } });
    return response.data;
};

export const upsertMantraProgress = async (payload: {
    mantra_id: string;
    times_practiced: number;
}) => {
    const response = await axios.post(API.ME.MANTRA_PROGRESS, payload, { headers: { ...getAuthHeaders() } });
    return response.data;
};

export const getMeditationReviews = async (meditationId: string): Promise<ReviewItem[]> => {
    const response = await axios.get(API.MEDITATIONS.REVIEWS(meditationId), { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const createMeditationReview = async (meditationId: string, payload: { rating: number; comment?: string }) => {
    const response = await axios.post(API.MEDITATIONS.REVIEWS(meditationId), payload, { headers: { ...getAuthHeaders() } });
    return response.data;
};

export const getYogaReviews = async (yogaId: string): Promise<ReviewItem[]> => {
    const response = await axios.get(API.YOGAS.REVIEWS(yogaId), { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const createYogaReview = async (yogaId: string, payload: { rating: number; comment?: string }) => {
    const response = await axios.post(API.YOGAS.REVIEWS(yogaId), payload, { headers: { ...getAuthHeaders() } });
    return response.data;
};

export const getMantraReviews = async (mantraId: string): Promise<ReviewItem[]> => {
    const response = await axios.get(API.MANTRAS.REVIEWS(mantraId), { headers: { ...getAuthHeaders() } });
    return response.data ?? [];
};

export const createMantraReview = async (mantraId: string, payload: { rating: number; comment?: string }) => {
  const response = await axios.post(API.MANTRAS.REVIEWS(mantraId), payload, { headers: { ...getAuthHeaders() } });
  return response.data;
};

export const createMoodCheckin = async (payload: { mood_code: string; note?: string }) => {
  try {
    const response = await axios.post(API.HOME.MOOD_CHECKINS, payload, { headers: { ...getAuthHeaders() } });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(toErrorMessage(err, "Failed to record mood"));
  }
};
