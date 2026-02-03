// server side processing 
"use server"
import { registerUser, loginUser, updateProfile } from "../api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleRegister = async (formData: any) => {
    try {
        // Split full name into firstName and lastName
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0];

        // Generate username from email (remove @domain)
        const username = formData.email.split('@')[0];

        // Create payload matching backend expectations
        const payload = {
            firstName,
            lastName,
            username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        const result = await registerUser(payload);
        if (result.success) {
            return {
                success: true,
                message: "Registration successful",
                data: result.data
            }
        };
        return {
            success: false,
            message: result.message || "Registration failed"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Registration failed"
        }
    }
}

export const handleLogin = async (formData: any) => {
    try {
        const result = await loginUser(formData);
        if (result.success) {
            await setAuthToken(result.token)
            await setUserData(result.data)

            return {
                success: true,
                message: "Login successful",
                data: result.data,
                token: result.token
            };
        }
        return {
            success: false,
            message: result.message || "Login failed"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Login failed"
        }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data);
            revalidatePath('/my-profile');
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

