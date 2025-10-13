import { Message } from "../models/message.model.js";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { io, userSocketMap } from "../index.js";

//get all users except loggedin user
export const getUsersForSlider = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const textedMessages = await Message.find({
            $and: [
                {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                { channelId: { $exists: false } }
            ]
        }).populate('senderId receiverId', '-password').sort({ createdAt: -1 });

        // Extract unique user IDs that the current user has chatted with
        const chattedUserIds = new Set();
        textedMessages.forEach(message => {
            // Ignore messages that belong to channels
            if (message.channelId) return;

            if (message.senderId && message.senderId._id.toString() !== userId.toString()) {
                chattedUserIds.add(message.senderId._id.toString());
            }
            if (message.receiverId && message.receiverId._id.toString() !== userId.toString()) {
                chattedUserIds.add(message.receiverId._id.toString());
            }
        });
        const chattedUsers = await User.find({
            _id: { $in: Array.from(chattedUserIds) }
        }).select("-password");

        //count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { users: filteredUsers, chattedUsers, unseenMessages },
                    "get users successfully!!"
                )
            )
    } catch (error) {
        console.error("Error in getUsersForSlider:", error);
        throw new ApiError(500, "Failed to get users!")
    }
})

//get all messages for selected users
export const getMessages = asyncHandler(async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        }).populate('senderId', 'fullName email profilePic').populate('receiverId', 'fullName email profilePic');

        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId },
            { seen: true }
        );
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { messages },
                    "get messages successfully"
                )
            )
    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, error.message);
    }
})

//get all messages for selected users
export const getChannelMessages = asyncHandler(async (req, res) => {
    try {
        const { id: channelId } = req.params;
        const currChannel = await Channel.findOne({ joinId: channelId });
        //extract the required Id
        if (!currChannel) {
            new ApiError(401, "channel not found!!")
        }
        const requiredId = currChannel?._id;
        //extract the required Id
        if (!requiredId) {
            new ApiError(401, "channelId is not Join Id")
        }
        const messages = await Message.find({ channelId: requiredId })
            .populate('senderId', 'fullName email profilePic');

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { messages },
                    `get messages of channelId ${channelId} successfully`
                )
            )
    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, error.message);
    }
})

//api to mark messages true as seen using message id
export const markMessageAsSeen = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "marked messages seen")
            )
    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, error.message);
    }
})

//send message
export const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { text } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (req.file) {
            const uploadResponse = await uploadOnCloudinary(req.file.path);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, { message: newMessage }, "message send successfully!!")
            )
    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, error.message);
    }
})

//send message to channels
export const sendMessageToChannel = asyncHandler(async (req, res) => {
    try {
        const { text } = req.body;
        const channelId = req.params.id;
        const senderId = req.user._id;

        const currChannel = await Channel.findOne({ channelId });
        //extract the required Id
        if (!currChannel) {
            new ApiError(401, "channel not found!!")
        }
        const requiredId = currChannel?._id;
        //extract the required Id
        if (!requiredId) {
            new ApiError(401, "channelId is not Join Id")
        }

        let imageUrl;
        if (req.file) {
            const uploadResponse = await uploadOnCloudinary(req.file.path);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            channelId: requiredId,
            text,
            image: imageUrl
        })
        io.to(channelId).emit("newChannelMessage", newMessage);
        return res
            .status(200)
            .json(
                new ApiResponse(200, { message: newMessage }, "message send successfully!!")
            )
    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, error.message);
    }
})