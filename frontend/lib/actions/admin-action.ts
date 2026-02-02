"use server"

import { createUser, updateUser, deleteUser, getAllUsers } from "@/lib/api/admin";
import { revalidatePath } from "next/cache";

export async function handleCreateUser(formData: FormData) {
    try {
        const result = await createUser(formData);
        if (result.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User created successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to create user' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export async function handleUpdateUser(id: string, formData: FormData) {
    try {
        const result = await updateUser(id, formData);
        if (result.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update user' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export async function handleDeleteUser(id: string) {
    try {
        const result = await deleteUser(id);
        if (result.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User deleted successfully'
            };
        }
        return { success: false, message: result.message || 'Failed to delete user' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}
