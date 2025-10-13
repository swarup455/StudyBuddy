import { io } from "socket.io-client";

let socket = null;
export const connectSocket = (userId, onOnlineUsers) => {
    if (!socket) {
        socket = io("http://localhost:8000", {
            query: { userId },
            withCredentials: true,
        });

        if (onOnlineUsers) {
            socket.on("getOnlineUsers", onOnlineUsers);
        }
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