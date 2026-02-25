const isServer = typeof window === "undefined";

const getClientCookie = (name: string): string | null => {
    if (typeof document === "undefined") {
        return null;
    }

    const encodedName = `${name}=`;
    const allCookies = document.cookie.split(";");

    for (const cookie of allCookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(encodedName)) {
            return trimmed.substring(encodedName.length);
        }
    }

    return null;
};

export const setAuthToken = async (token: string) => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set({ name: "auth_token", value: token, path: "/" });
        return;
    }
    document.cookie = `auth_token=${token}; path=/`;
};

export const getAuthToken = async () => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        return token || null;
    }
    const token = getClientCookie("auth_token");
    return token || null;
};

export const setUserData = async (userData: any) => {
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.set({ name: "user_data", value: encodedUserData, path: "/" });
        return;
    }
    document.cookie = `user_data=${encodedUserData}; path=/`;
};

export const getUserData = async () => {
    if (isServer) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const userData = cookieStore.get("user_data")?.value;
        if (userData) {
            return JSON.parse(decodeURIComponent(userData));
        }
        return null;
    }
    const raw = getClientCookie("user_data");
    return raw ? JSON.parse(decodeURIComponent(raw)) : null;
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
};
