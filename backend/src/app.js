import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/User.route.js"
import chatRouter from "./routes/Chat.route.js"
import channelRouter from "./routes/Channel.route.js"
import { errorHandler } from "./middlewares/error.middleware.js"

//create express app and http server
const app = express()

//middleware setup
app.use(express.json({ limit: "4mb" }))

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())

//route setup
app.use("/api/auth", userRouter)
app.use("/api/status", (req, res)=>res.send("server is live"));
app.use("/api/chat", chatRouter)
app.use("/api/channel", channelRouter)

app.use(errorHandler);

export {app}