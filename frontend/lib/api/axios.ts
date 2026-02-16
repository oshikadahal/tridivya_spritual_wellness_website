import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5051';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
});

export default axiosInstance;