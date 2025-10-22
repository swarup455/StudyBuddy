import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createChannel,
    deleteChannel,
    getAllChannels,
    getDocument,
    joinChannel,
    kickOutUser,
    leaveChannel,
    saveDocument,
    updateChannel,
    updateRole,
    uploadImage
} from "../controllers/channel.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const channelRouter = express.Router()

channelRouter.post("/create-channel", verifyJWT, createChannel);
channelRouter.post("/join-channel/:channelId", verifyJWT, joinChannel);
channelRouter.delete("/delete-channel/:channelId", verifyJWT, deleteChannel);
channelRouter.delete("/leave-channel/:channelId", verifyJWT, leaveChannel);
channelRouter.delete("/kickout-user/:channelId", verifyJWT, kickOutUser);
channelRouter.put("/update-role/:channelId", verifyJWT, updateRole);
channelRouter.put("/update-channel/:channelId", verifyJWT, upload.single("channelLogo"), updateChannel);
channelRouter.get("/get-channels", verifyJWT, getAllChannels);
channelRouter.put("/save-document/:channelId", saveDocument);
channelRouter.post("/upload-image", upload.single("file"), uploadImage);
channelRouter.get("/get-document/:channelId", getDocument);

export default channelRouter