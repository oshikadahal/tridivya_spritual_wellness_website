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
