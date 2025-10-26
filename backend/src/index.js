import dotenv from "dotenv"
import connectDB from "./db/database.js"
dotenv.config({ path: './.env' })
import http from "http"
import { app } from "./app.js"
import { Server } from "socket.io"

const server = http.createServer(app)

//initialize socket io server
export const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    },
});

//store online users
export const userSocketMap = {};

//socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if (userId) userSocketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("joinChannel", ({ channelId, user }) => {
        socket.join(channelId);
        console.log(`User ${user.fullName} joined channel ${channelId}`);
    });

    // Leave a channel room
    socket.on("leaveChannel", ({ channelId, user }) => {
        socket.leave(channelId);
        console.log(`User ${user.fullName} left channel ${channelId}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.error("Server error:", err);
        });

        const currPort = process.env.PORT || 8000;
        server.listen(currPort, () => {
            console.log(`server is running at port: ${currPort}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed!!!", err)
    })