import axios from "./axios";
import { API } from "./endpoints";

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

export interface Announcement {
    id: string;
    title: string;
    message: string;
    tone: 'calm' | 'empower' | 'celebrate';
    status: 'draft' | 'scheduled' | 'published';
    scheduled_at?: string;
    published_at?: string;
    created_by: string;
    updated_by?: string;
    created_at: string;
    updated_at: string;
}

export interface AnnouncementFormData {
    title: string;
    message: string;
    tone: 'calm' | 'empower' | 'celebrate';
    status?: 'draft' | 'scheduled' | 'published';
    scheduled_at?: Date | null;
}

// GET all announcements (admin only)
export const getAllAnnouncements = async (page = 1, limit = 10, status?: string) => {
    try {
        const response = await axios.get(API.ADMIN.ANNOUNCEMENTS, {
            params: { page, limit, ...(status && { status }) },
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch announcements"));
    }
};

// GET public announcements
export const getPublicAnnouncements = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API.PUBLIC.ANNOUNCEMENTS, {
            params: { page, limit },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch public announcements"));
    }
};

// GET single announcement (admin only)
export const getAnnouncementById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.ANNOUNCEMENT_BY_ID(id), {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to fetch announcement"));
    }
};

// CREATE announcement (admin only)
export const createAnnouncement = async (data: AnnouncementFormData) => {
    try {
        const payload = {
            title: data.title,
            message: data.message,
            tone: data.tone,
            status: data.status || 'draft',
            ...(data.scheduled_at && { scheduled_at: data.scheduled_at.toISOString() }),
        };

        const response = await axios.post(API.ADMIN.ANNOUNCEMENTS, payload, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to create announcement"));
    }
};

// UPDATE announcement (admin only)
export const updateAnnouncement = async (id: string, data: Partial<AnnouncementFormData>) => {
    try {
        const payload: any = {};
        if (data.title) payload.title = data.title;
        if (data.message) payload.message = data.message;
        if (data.tone) payload.tone = data.tone;
        if (data.status) payload.status = data.status;
        if (data.scheduled_at) payload.scheduled_at = data.scheduled_at.toISOString();

        const response = await axios.patch(API.ADMIN.ANNOUNCEMENT_BY_ID(id), payload, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to update announcement"));
    }
};

// DELETE announcement (admin only)
export const deleteAnnouncement = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.ANNOUNCEMENT_BY_ID(id), {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to delete announcement"));
    }
};

// PUBLISH announcement (admin only)
export const publishAnnouncement = async (id: string) => {
    try {
        const response = await axios.post(API.ADMIN.PUBLISH_ANNOUNCEMENT(id), {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(toErrorMessage(err, "Failed to publish announcement"));
    }
};
