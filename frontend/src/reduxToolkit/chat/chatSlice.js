import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./chatApi";
import toast from "react-hot-toast"
import { getSocket } from "../../../utils/socket";
import { extractErrorMessage } from "../../../utils/errorHandler";

//created socket 
const socket = getSocket();

//get all users from backend
export const getAllUsers = createAsyncThunk(
    "chat/getUsers", async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/users");
            return res.data.data;
        } catch (error) {
            toast.error(extractErrorMessage(error) || "Can't get all users!")
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//get messages
export const getMessages = createAsyncThunk(
    "chat/getMessages", async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/${userId}`);
            return res.data.data.messages;
        } catch (error) {
            toast.error(extractErrorMessage(error) || "Can't get messages!")
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)
//get messages
export const getChannelMessages = createAsyncThunk(
    "chat/getChannelMessages", async (channelId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/get-channel-messages/${channelId}`);
            return res.data.data.messages;
        } catch (error) {
            toast.error(extractErrorMessage(error) || "Can't get messages!")
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//send message to a selected user
export const sendMessage = createAsyncThunk(
    "chat/sendMessage", async ({ userId, authUser, messageData }, { rejectWithValue, dispatch }) => {
        try {
            const currMessage = {
                _id: `temp-${Date.now()}`,
                sender: {
                    _id: authUser._id,
                    fullName: authUser.fullName,
                    profilePic: authUser.profilePic,
                    email: authUser.email
                },
                receiver: userId,
                text: messageData.text,
                image: messageData.image ? URL.createObjectURL(messageData.image) : null,
                createdAt: new Date().toISOString(),
                status: true
            };
            dispatch(addNewMessage(currMessage));
            dispatch(setLastMessageId(currMessage._id));
            const formData = new FormData();
            // Only append text if it exists
            if (messageData.text) {
                formData.append("text", messageData.text);
            }
            // Only append image if it exists and is a File object
            if (messageData.image && messageData.image instanceof File) {
                formData.append("image", messageData.image);
            }

            const res = await api.post(`/send/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { tempId: currMessage._id, message: res.data.data.message };
        } catch (error) {
            toast.error(extractErrorMessage(error) || "Can't send message!")
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//send message to a channel user
export const sendMessageToChannel = createAsyncThunk(
    "chat/sendMessageToChannel", async ({ channelId, authUser, messageData }, { rejectWithValue, dispatch }) => {
        try {
            const currMessage = {
                _id: `temp-${Date.now()}`,
                sender: {
                    _id: authUser._id,
                    fullName: authUser.fullName,
                    profilePic: authUser.profilePic,
                    email: authUser.email
                },
                channelId,
                text: messageData.text,
                image: messageData.image ? URL.createObjectURL(messageData.image) : null,
                createdAt: new Date().toISOString(),
                status: true
            };
            dispatch(addNewMessage(currMessage));
            dispatch(setLastMessageId(currMessage._id));

            const formData = new FormData();
            // Only append text if it exists
            if (messageData.text) {
                formData.append("text", messageData.text);
            }
            // Only append image if it exists and is a File object
            if (messageData.image && messageData.image instanceof File) {
                formData.append("image", messageData.image);
            }

            const res = await api.post(`/send-to-channel/${channelId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { tempId: currMessage._id, message: res.data.data.message };
        } catch (error) {
            toast.error(extractErrorMessage(error) || "Can't send message!")
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        users: [],
        lastMessageId: null,
        chattedUsers: [],
        unseenMessages: {},
        pending: false,
        error: null
    },
    reducers: {
        addNewMessage: (state, action) => {
            const newMessage = action.payload;
            // Add to messages array
            state.messages.push(newMessage);
        },
        setLastMessageId: (state, action) => {
            state.lastMessageId = action.payload;
        },
        // Update unseen message count
        incrementUnseenCount: (state, action) => {
            const senderId = action.payload;
            const count = state.unseenMessages[senderId];
            state.unseenMessages = {
                ...state.unseenMessages,
                [senderId]: count ? count + 1 : 1
            };
        }
    },
    extraReducers: (builder) => {
        builder
            //get users
            .addCase(getAllUsers.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.users = action.payload.users;
                state.chattedUsers = action.payload.chattedUsers;
                state.unseenMessages = action.payload.unseenMessages
                state.pending = false;
                state.error = null;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //get messages
            .addCase(getMessages.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.pending = false;
                state.error = null;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //get messages of channel
            .addCase(getChannelMessages.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(getChannelMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.pending = false;
                state.error = null;
            })
            .addCase(getChannelMessages.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //send messages
            .addCase(sendMessage.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { tempId, message } = action.payload;
                const index = state.messages.findIndex((m) => m._id === tempId);
                if (index !== -1) {
                    state.messages[index] = message;
                } else {
                    state.messages.push(message);
                }
                state.lastMessageId = tempId;
                state.pending = false;
                state.error = null;
            })

            .addCase(sendMessage.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //send messages to channel
            .addCase(sendMessageToChannel.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(sendMessageToChannel.fulfilled, (state, action) => {
                const { tempId, message } = action.payload;
                const index = state.messages.findIndex((m) => m._id === tempId);
                if (index !== -1) {
                    state.messages[index] = message;
                } else {
                    state.messages.push(message);
                }
                state.lastMessageId = tempId;
                state.pending = false;
                state.error = null;
            })

            .addCase(sendMessageToChannel.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
    }
})

export const { addNewMessage, setLastMessageId, incrementUnseenCount } = chatSlice.actions;
export default chatSlice.reducer;