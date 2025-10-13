import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getChannelMessages, getMessages, getUsersForSlider, markMessageAsSeen, sendMessage, sendMessageToChannel } from "../controllers/chat.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const chatRouter = express.Router()

chatRouter.get("/users", verifyJWT, getUsersForSlider);
chatRouter.get("/:id", verifyJWT, getMessages);
chatRouter.get("/get-channel-messages/:id", getChannelMessages);
chatRouter.put("/mark/:id", verifyJWT, markMessageAsSeen);
chatRouter.post("/send/:id", verifyJWT, upload.single("image"), sendMessage);
chatRouter.post("/send-to-channel/:id", verifyJWT, upload.single("image"), sendMessageToChannel);

export default chatRouter