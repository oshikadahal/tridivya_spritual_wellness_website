import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const getClientCookie = (name: string): string | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(cookieName)) {
            return trimmedCookie.substring(cookieName.length);
        }
    }

    return null;
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = getClientCookie('auth_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;