import { io } from "socket.io-client";

let socket = null;
export const connectSocket = (userId, onOnlineUsers) => {
    if (!socket) {
        socket = io(`${import.meta.env.VITE_API_URI}`, {
            query: { userId },
            withCredentials: true,
        });

        socket.on("getOnlineUsers", (users) => {
            if (onOnlineUsers) onOnlineUsers(users);
        });
    }
    return socket;
};
export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};