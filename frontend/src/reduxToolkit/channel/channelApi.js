import axios from 'axios';

const baseConfig = {
    baseURL: "http://localhost:8000/api/channel",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
};

const api = axios.create(baseConfig);

export default api;