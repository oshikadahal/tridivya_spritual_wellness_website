//backend api call only

import axios from "./axios";
import { API } from "./endpoints";
import { getAuthToken } from "../cookie";

export const registerUser = async (registerData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.REGISTER,
            registerData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Registration failed"
        );
    }
}

export const loginUser = async (loginData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.LOGIN,
            loginData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Login failed"
        );
    }
}

export const forgotPassword = async (payload: { email: string }) => {
    try {
        const response = await axios.post(
            API.AUTH.FORGOT_PASSWORD,
            payload
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Request failed"
        );
    }
}

export const resetPassword = async (payload: { token: string; password: string; confirmPassword: string }) => {
    try {
        const response = await axios.post(
            API.AUTH.RESET_PASSWORD,
            payload
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Reset failed"
        );
    }
}

export const updateProfile = async (profileData: FormData) => {
    try {
        const token = await getAuthToken();
        const response = await axios.put(
            '/api/auth/update-profile',
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error.response?.data?.message
            || error.message
            || 'Update profile failed'
        );
    }
}

// GET user profile
export const getUserProfile = async () => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(
            API.AUTH.GET_PROFILE,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error.response?.data?.message
            || error.message
            || 'Failed to fetch profile'
        );
    }
}

// UPDATE user profile with image
export const updateUserProfile = async (profileData: FormData) => {
    try {
        const token = await getAuthToken();
        const response = await axios.put(
            API.AUTH.UPDATE_PROFILE_PICTURE,
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error.response?.data?.message
            || error.message
            || 'Failed to update profile'
        );
    }
}

// DELETE user profile picture
export const deleteUserProfilePicture = async () => {
    try {
        const token = await getAuthToken();
        const response = await axios.delete(
            API.AUTH.DELETE_PROFILE_PICTURE,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error.response?.data?.message
            || error.message
            || 'Failed to delete profile picture'
        );
    }
}
