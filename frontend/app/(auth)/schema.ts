import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Enter your valid email" }),
    password: z.string().min(6, { message: " Must Be Minimum 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Enter your full name" }).trim(),
    email: z.string().email({ message: "Enter your valid email" }).trim(),
    password: z.string().min(6, { message: "Must Be Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Must Be Minimum 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Enter your valid email" }),
});
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    password: z.string().min(6, { message: "Must Be Minimum 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Must Be Minimum 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;