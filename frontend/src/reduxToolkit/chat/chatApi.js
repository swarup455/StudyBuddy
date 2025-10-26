import axios from 'axios';

const baseConfig = {
    baseURL: `${import.meta.env.VITE_API_URI}/api/chat`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
};

const api = axios.create(baseConfig);

export default api;