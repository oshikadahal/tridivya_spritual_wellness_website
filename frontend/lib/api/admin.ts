//backend api call for admin operations

import axios from "./axios";
import { API } from "./endpoints";
import { CreateBookingData, UpdateBookingData } from "./booking";

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

// GET all users
export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(API.ADMIN.USERS, {
            params: { page, limit },
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        console.error("getAllUsers error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            url: err.config?.url,
            baseURL: err.config?.baseURL
        });
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch users"
        );
    }
}

// GET user by ID
export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.USER_BY_ID(id), {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch user"
        );
    }
}

// CREATE user with FormData (for image upload)
export const createUser = async (userData: FormData) => {
    try {
        const response = await axios.post(
            API.ADMIN.CREATE_USER,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeaders(),
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create user"
        );
    }
}

// UPDATE user with FormData (for image upload)
export const updateUser = async (id: string, userData: FormData) => {
    try {
        const response = await axios.put(
            API.ADMIN.UPDATE_USER(id),
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeaders(),
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update user"
        );
    }
}

// DELETE user
export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.DELETE_USER(id), {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete user"
        );
    }
}

// UPDATE profile (for logged in user)
export const updateProfile = async (id: string, userData: FormData) => {
    try {
        const response = await axios.put(
            API.AUTH.UPDATE_PROFILE(id),
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update profile"
        );
    }
}

// GET admin profile
export const getAdminProfile = async () => {
    try {
        const response = await axios.get(API.ADMIN.GET_PROFILE, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch admin profile"
        );
    }
}

// UPDATE admin profile with image
export const updateAdminProfile = async (profileData: FormData) => {
    try {
        const response = await axios.put(
            API.ADMIN.UPDATE_PROFILE,
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeaders(),
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update admin profile"
        );
    }
}

// DELETE admin profile picture
export const deleteAdminProfilePicture = async () => {
    try {
        const response = await axios.delete(API.ADMIN.DELETE_PROFILE_PICTURE, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete profile picture"
        );
    }
}

export const getAllBookingsAdmin = async (status?: "upcoming" | "completed" | "cancelled") => {
    try {
        const response = await axios.get(API.ADMIN.BOOKINGS, {
            params: status ? { status } : undefined,
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch bookings"
        );
    }
}

export const createBookingAdmin = async (data: CreateBookingData) => {
    try {
        const response = await axios.post(API.ADMIN.CREATE_BOOKING, data, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create booking"
        );
    }
}

export const updateBookingAdmin = async (id: string, data: UpdateBookingData) => {
    try {
        const response = await axios.put(API.ADMIN.UPDATE_BOOKING(id), data, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update booking"
        );
    }
}

export const updateBookingStatusAdmin = async (
    id: string,
    status: "upcoming" | "completed" | "cancelled"
) => {
    try {
        const response = await axios.patch(
            API.ADMIN.BOOKING_STATUS(id),
            { status },
            {
                headers: {
                    ...getAuthHeaders(),
                },
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update booking status"
        );
    }
}

export const deleteBookingAdmin = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.BOOKING_BY_ID(id), {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete booking"
        );
    }
}

export const getAdminDashboardOverview = async () => {
    try {
        const response = await axios.get(API.ADMIN.DASHBOARD_OVERVIEW, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch admin dashboard overview"
        );
    }
}
