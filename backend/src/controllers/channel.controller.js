import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from "nanoid"
import { Channel } from "../models/channel.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

//function to generate Ids
export const generateId = () => {
    return nanoid(10);
}

//controller for creating a new channel
export const createChannel = asyncHandler(async (req, res) => {
    const { channelName } = req.body;
    const userId = req.user._id;

    // Validation
    if (!channelName || channelName.trim() === '') {
        throw new ApiError(400, "Channel name is required!");
    }
    if (channelName.trim().length < 3) {
        throw new ApiError(400, "Channel name must be at least 3 characters!");
    }
    if (channelName.trim().length > 50) {
        throw new ApiError(400, "Channel name must not exceed 50 characters!");
    }
    const sameNameChannel = await Channel.findOne({ channelName });
    if(sameNameChannel){
        throw new ApiError(400, `Channel with name "${channelName}" already exist!`);
    }
    let joinId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
        joinId = generateId();
        const existingChannel = await Channel.findOne({ joinId });
        if (!existingChannel) {
            isUnique = true;
        }
        attempts++;
    }
    
    if (!isUnique) {
        return res.status(500).json(
            new ApiResponse(500, {}, "Failed to generate unique Id Please try again!")
        );
    }

    // Create channel with admin as first participant
    const channel = await Channel.create({
        channelName: channelName.trim(),
        channelAdmin: userId,
        joinId,
        participants: [
            {
                user: userId,
                role: 'Editor',
                status: 'joined',
                isGuest: false,
                joinedAt: new Date()
            }
        ]
    });
    // Populate user details if needed
    await channel.populate('channelAdmin', 'fullName email profilePic');
    return res
        .status(201)
        .json(
            new ApiResponse(201, { channel }, "Channel Created successfully!")
        )
})

//controler to join a channel
export const joinChannel = asyncHandler(async (req, res) => {
    const userId = req.body;
    const {id: joinId} = req.params;

})

//controller for get all channels
export const getAllChannels = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const channels = await Channel.find({
            $or: [
                { channelAdmin: userId },
                { 'participants.user': userId }
            ]
        })
            .populate('channelAdmin', 'fullName email profilePic')
            .populate('participants.user', 'fullName email profilePic')
            .sort({ updatedAt: -1 });

        return res
            .status(201)
            .json(
                new ApiResponse(201, { channels }, "Successfully got all channels!")
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Creating Channel error");
    }
})