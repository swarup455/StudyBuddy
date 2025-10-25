import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from "nanoid"
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { io } from "../index.js";
import { Message } from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

    let channelId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
        channelId = generateId();
        const existingChannel = await Channel.findOne({ channelId });
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
    const newChannel = await Channel.create({
        channelName: channelName.trim(),
        channelAdmin: userId,
        channelId,
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
    const channel = await Channel.findById(newChannel._id)
        .populate('channelAdmin', 'fullName email profilePic')
        .populate('participants.user', 'fullName email profilePic');

    return res
        .status(201)
        .json(
            new ApiResponse(201, { channel }, "Channel Created successfully!")
        )
})

//controler to join a channel
export const joinChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { guest } = req.body;
    const userId = req.user._id;

    //channel validation
    if (!channelId) {
        throw new ApiError(400, "Join Id is required!!");
    }
    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found!!")
    }

    //guest validation
    const isGuest = !userId;
    if (isGuest && !channel.allowGuests) {
        throw new ApiError(403, "This channel does not allow guest participants!!");
    }
    if (isGuest && !guest) {
        throw new ApiError(400, "Guest name is required for guest participants!!");
    }

    //user validation
    let user;
    if (!isGuest) {
        user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found!!");
        }
    }

    //Check if user/guest is already a participant
    let existingParticipant;
    if (isGuest) {
        // For guests, check by guestTempId or guestName (optional - depends on your logic)
        existingParticipant = channel.participants.find(
            p => p.isGuest && p.guestName === guest.trim()
        );
    } else {
        // For authenticated users
        existingParticipant = channel.participants.find(
            p => !p.isGuest && p.user?.toString() === userId.toString()
        );
    }
    if (existingParticipant) {
        return res.status(400).json(
            new ApiResponse(
                400,
                { channel, participant: existingParticipant },
                "You are already a participant!"
            )
        );
    }

    //check if channel can add more participants
    if (!channel.canAddParticipant()) {
        throw new ApiError(403, `Channel has reached maximum capacity of ${channel.maxParticipants} participants!`)
    }

    let newParticipant = {
        isGuest,
        joinedAt: new Date()
    };
    if (isGuest) {
        newParticipant.guestName = guest.trim();
        newParticipant.guestTempId = generateId();
    } else {
        newParticipant.user = userId;
    }

    channel.participants.push(newParticipant);
    await channel.save();
    // Populate user details for response
    if (!isGuest) {
        await channel.populate('participants.user', 'fullName email profilePic');
    }
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { channel, participant: newParticipant },
                `Successfully joined channel ${channel.channelName}`
            )
        );

})

//controller to delete a channel
export const deleteChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    if (!channelId) {
        throw new ApiError(400, "ChannelId is required!!");
    }
    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found!!");
    }

    // Check if user is the channel admin
    if (channel.channelAdmin.toString() !== userId.toString()) {
        throw new ApiError(403, "Only channel admin can delete this channel!!");
    }

    // Store channel name before deletion
    const channelName = channel.channelName;

    // Delete using channelId
    await Message.deleteMany({ channelId });
    await Channel.deleteOne({ channelId });

    return res
        .status(200)
        .json(
            new ApiResponse(201, { channelId: channelId }, `Channel "${channelName}" deleted Successfully!!`)
        )
})

//controller to leave a channel
export const leaveChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { guestTempId, newAdminId } = req.body;
    const userId = req.user?._id;

    const isGuest = !userId;
    //channel validation
    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found!");
    }

    let participantIndex;

    if (isGuest && guestTempId) {
        // guest users leave by their tempId
        participantIndex = channel.participants.findIndex(
            (p) => p.guestTempId === guestTempId
        );
    } else if (userId) {
        // registered user leaves by userId
        participantIndex = channel.participants.findIndex(
            (p) => p.user && p.user.toString() === userId.toString()
        );
    } else {
        throw new ApiError(400, "Invalid leave request. No valid user or guest identifier provided.");
    }

    if (participantIndex === -1) {
        throw new ApiError(404, "You are not a participant in this channel.");
    }
    // Check if the user leaving is the admin
    const isAdminLeaving = !isGuest && channel.channelAdmin.toString() === userId?.toString();

    if (isAdminLeaving) {
        if (channel.participants.length > 1) {
            if (!newAdminId) {
                throw new ApiError(401, "Provide new AdminId to leave the channel!!")
            } else {
                channel.channelAdmin = newAdminId;
                const user = channel.participants.find((p) => p.user?.toString() === newAdminId.toString());
                user.role = "Editor";
            }
        } else {
            await Channel.deleteOne({ _id: channel._id });
            return res
                .status(200)
                .json(new ApiResponse(200, {}, "Channel deleted as admin left and no participants remained."));
        }
    }
    channel.participants.splice(participantIndex, 1);

    //Save the updated channel
    await channel.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { channel },
                isGuest
                    ? "Guest has left the channel successfully."
                    : "You have left the channel successfully."
            )
        );

})

//controller to kick user out of channel
export const kickOutUser = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId, guestTempId } = req.body;

    //validation of channel
    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found!!");
    }
    //only admin can kick out user
    if (req.user && req.user._id.toString() !== channel.channelAdmin.toString()) {
        throw new ApiError(400, "Only admin can kick out user!!")
    }

    // Determine if target is a guest or registered user
    const isGuest = !userId && guestTempId;

    let participantIndex;
    if (isGuest) {
        participantIndex = channel.participants.findIndex(
            (p) => p.guestTempId === guestTempId
        );
    } else {
        participantIndex = channel.participants.findIndex(
            (p) => p.user && p.user.toString() === userId
        );
    }
    if (participantIndex === -1) {
        throw new ApiError(404, "Participant not found in this channel!");
    }

    //Remove the participant
    const removedParticipant = channel.participants.splice(participantIndex, 1)[0];

    if (!isGuest && removedParticipant.user) {
        await Channel.populate(removedParticipant, { path: "user", select: "fullName email profilePic" });
    }

    await channel.save();
    //emit kick out event 
    if (io) {
        io.to(channelId).emit("participantKicked", {
            channelId,
            kickedUser: isGuest ? guestTempId : userId,
            isGuest,
        });
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { channel, removedParticipant },
                isGuest
                    ? "Guest has left the channel successfully."
                    : "You have left the channel successfully."
            )
        );

})

//controller to update role of an user
export const updateRole = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId, role } = req.body;

    if (!channelId || !userId || !role) {
        throw new ApiError(400, "All fields are required!!");
    }
    //find channel using channel id
    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel is not found!!");
    }
    // Check if user is the channel admin
    if (channel.channelAdmin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only Admin can change members roles!!");
    }
    // find() returns array, use find() not findOne()
    const currUser = channel.participants.find(p =>
        p.user && p.user.toString() === userId
    );
    if (!currUser) {
        throw new ApiError(404, `User not found in channel "${channel.channelName}"`);
    }
    if (role == "Editor" && !channel.canAddEditor()) {
        throw new ApiError(403, `Cannot upgrade to Editor. Maximum ${channel.maxEditors} editors allowed`);
    }
    currUser.role = role;
    await channel.save();
    return res
        .status(200)
        .json(
            new ApiResponse(200, { user: currUser, role }, "Update role successfully!!")
        )

})

//update channel details
export const updateChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;
    const {
        channelName,
        channelAbout,
        maxParticipants,
        maxEditors,
        allowGuests,
        newAdminId,
        removeLogo
    } = req.body;

    //find channel using id
    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found!!");
    }
    if (channel.channelAdmin.toString() !== userId.toString()) {
        throw new ApiError(403, "Only admin can update channel settings!!");
    }
    //getting fields
    const updates = {};
    if (channelName && channelName.trim()) updates.channelName = channelName.trim();
    if (channelAbout && channelAbout.trim()) updates.channelAbout = channelAbout.trim();
    if (removeLogo === "true") {
        updates.channelLogo = null;
    } else if (req.file) {
        const uploadResponse = await uploadOnCloudinary(req.file.path);
        updates.channelLogo = uploadResponse.secure_url;
    }
    
    const parsedMaxParticipants = Number(maxParticipants);
    const parsedMaxEditors = Number(maxEditors);

    if (!isNaN(parsedMaxParticipants) && parsedMaxParticipants !== channel.maxParticipants) {
        if (parsedMaxParticipants < 1) throw new ApiError(400, "maxParticipants must be at least 1");
        updates.maxParticipants = parsedMaxParticipants;
    }

    if (!isNaN(parsedMaxEditors) && parsedMaxEditors !== channel.maxEditors) {
        if (parsedMaxEditors < 1) throw new ApiError(400, "maxEditors must be at least 1");
        updates.maxEditors = parsedMaxEditors;
    }

    // ✅ Handle booleans (FormData sends them as "true"/"false" strings)
    if (allowGuests !== undefined) {
        updates.allowGuests = allowGuests === "true";
    }

    if (newAdminId) {
        const newAdminExists = channel.participants.find(
            (item) => item.user && item.user.toString() === newAdminId
        )
        if (!newAdminExists) {
            throw new ApiError(404, "New admin user not found");
        }
        updates.channelAdmin = newAdminId;
    }
    //update channel
    const updatedChannel = await Channel.findOneAndUpdate(
        { channelId },
        { $set: updates },
        { new: true }
    ).populate("channelAdmin", "fullName email profilePic")
        .populate("participants.user", "fullName email profilePic");

    return res
        .status(200)
        .json(
            new ApiResponse(200, { channel: updatedChannel }, "Channel updated successfully!!")
        )
})

//controller for get all channels
export const getAllChannels = asyncHandler(async (req, res) => {
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
        .status(200)
        .json(
            new ApiResponse(200, { channels }, "Successfully got all channels!")
        )

})

//controller for save document
export const saveDocument = asyncHandler(async (req, res) => {
    const { update } = req.body;
    const { channelId } = req.params;

    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found to save document!!")
    }
    channel.document = update;
    await channel.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, { channel }, "Document updated Successfully!!")
        )
})

//controller to get document
export const getDocument = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const channel = await Channel.findOne({ channelId });
    if (!channel) {
        throw new ApiError(404, "Channel not found to save document!!")
    }
    const document = channel.document;
    return res
        .status(200)
        .json(
            new ApiResponse(200, { document }, "Document got Successfully!!")
        )
})

// Upload image for editor
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }
    let imgUrl;
    if (req.file) {
        const uploadResponse = await uploadOnCloudinary(req.file.path);
        imgUrl = uploadResponse.secure_url;
    }
    return res.status(200).json(
        new ApiResponse(200, { url: imgUrl }, "Image uploaded successfully")
    );
});