import axios from 'axios';

const baseConfig = {
    baseURL: "https://studybuddy-q5l4.onrender.com/api/chat",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
};

const api = axios.create(baseConfig);

export default api;