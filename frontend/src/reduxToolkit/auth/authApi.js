import axios from 'axios';

const baseConfig = {
    baseURL: "http://localhost:8000/api/auth",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
};

const api = axios.create(baseConfig);
const refreshApi = axios.create(baseConfig);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshApi.post("/refresh-access-token", {});

                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;