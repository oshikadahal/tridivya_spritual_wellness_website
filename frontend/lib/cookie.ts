const isServer = typeof window === "undefined";

export const setAuthToken = async (token: string) => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set({ name: "auth_token", value: token });
        return;
    }
    document.cookie = `auth_token=${token}; path=/`;
    localStorage.setItem("auth_token", token);
};

export const getAuthToken = async () => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        return token || null;
    }
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;
    return token || null;
};

export const setUserData = async (userData: any) => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set({ name: "user_data", value: JSON.stringify(userData) });
        return;
    }
    document.cookie = `user_data=${encodeURIComponent(JSON.stringify(userData))}; path=/`;
    localStorage.setItem("user_data", JSON.stringify(userData));
};

export const getUserData = async () => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const userData = cookieStore.get("user_data")?.value;
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    }
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("user_data") : null;
    return raw ? JSON.parse(raw) : null;
};

export const clearAuthCookies = async () => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.delete("auth_token");
        cookieStore.delete("user_data");
        return;
    }
    document.cookie = "auth_token=; Max-Age=0; path=/";
    document.cookie = "user_data=; Max-Age=0; path=/";
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
};
