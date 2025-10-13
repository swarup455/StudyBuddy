import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createChannel, getAllChannels } from "../controllers/channel.controller.js";

const channelRouter = express.Router()

channelRouter.post("/create-channel", verifyJWT, createChannel);
channelRouter.get("/get-channels", verifyJWT, getAllChannels);

export default channelRouter