//backend api call for admin operations

import axios from "./axios";
import { API } from "./endpoints";

const getClientAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getClientAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(API.ADMIN.USERS, {
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
