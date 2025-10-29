import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId, onOnlineUsers) => {
    if (socket && socket.connected) return socket;

    const baseURL = import.meta.env.VITE_API_URI;
    const socketURL = baseURL.replace(/^http/, "ws");

    socket = io(socketURL, {
        query: { userId },
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        console.log("Socket connected to", socketURL);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connect error:", err.message);
    });

    socket.on("getOnlineUsers", (users) => {
        if (onOnlineUsers) onOnlineUsers(users);
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected!");
    }
};