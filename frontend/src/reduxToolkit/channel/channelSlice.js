import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "./channelApi"
import { extractErrorMessage } from "../../../utils/errorHandler.js";

//thunk for creating channel
export const createChannel = createAsyncThunk(
    "channel/createChannel", async (channelName, { rejectWithValue }) => {
        try {
            const res = await api.post("/create-channel", { channelName });
            return res.data.data.channel;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for get all channels
export const getChannels = createAsyncThunk(
    "channel/getChannels", async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/get-channels");
            return res.data.data.channels;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for joinChannel
export const joinChannel = createAsyncThunk(
    "channel/joinChannel", async ({ guest, channelId }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/join-channel/${channelId}`, { guest });
            return res.data.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            if (errorMessage.includes("already a participant")) {
                const channelData = error.response?.data?.data;
                return rejectWithValue({
                    message: errorMessage,
                    channelId: channelData?.channel?.channelId,
                    channelName: channelData?.channel?.channelName,
                    isAlreadyMember: true
                });
            }
            return rejectWithValue(errorMessage);
        }
    }
)

//thunk for deleteChannel
export const deleteChannel = createAsyncThunk(
    "channel/deleteChannel", async (channelId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/delete-channel/${channelId}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for leaveChannel
export const leaveChannel = createAsyncThunk(
    "channel/leaveChannel", async ({ userData, channelId }, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/leave-channel/${channelId}`, { data: userData ? userData : {} });
            return res.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for kick out user
export const kickOutUser = createAsyncThunk(
    "channel/kickOutUser", async ({ userData, channelId }, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/kickout-user/${channelId}`, { data: userData });
            return res.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for update role
export const updateRole = createAsyncThunk(
    "channel/updateRole", async ({ channelId, userId, role }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/update-role/${channelId}`, { userId, role });
            return res.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for updateChannel
export const updateChannel = createAsyncThunk(
    "channel/updateChannel", async ({ channelData, channelId }, { rejectWithValue }) => {
        try {
            let dataToSend;
            if (channelData instanceof FormData) {
                dataToSend = channelData;
            } else {
                dataToSend = new FormData();
                Object.entries(channelData).forEach(([key, value]) => {
                    dataToSend.append(key, value);
                });
            }
            const res = await api.put(`/update-channel/${channelId}`, dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for save document
export const saveDocument = createAsyncThunk(
    "channel/saveDocument", async ({ update, channelId }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/save-document/${channelId}`, { update });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

//thunk for get document
export const getDocument = createAsyncThunk(
    "channel/getDocument", async (channelId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/get-document/${channelId}`);
            return res.data.data.document;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

const channelSlice = createSlice({
    name: "channel",
    initialState: {
        allChannels: [],
        document: "",
        responseMessage: "",
        pending: false,
        error: null
    },
    reducers: {
        addNewChannel: (state, action) => {
            state.allChannels = [action.payload, ...state.allChannels];
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => (
        builder
            //create channel 
            .addCase(createChannel.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(createChannel.fulfilled, (state, action) => {
                state.pending = false;
                state.allChannels = [action.payload, ...state.allChannels];
            })
            .addCase(createChannel.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //get all channels
            .addCase(getChannels.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(getChannels.fulfilled, (state, action) => {
                state.pending = false;
                state.allChannels = action.payload;
            })
            .addCase(getChannels.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //join channel
            .addCase(joinChannel.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(joinChannel.fulfilled, (state, action) => {
                state.pending = false;
                const channelIndex = state.allChannels.findIndex(
                    ch => ch.channelId === action.payload.channel.channelId
                );
                if (channelIndex !== -1) {
                    state.allChannels[channelIndex] = action.payload.channel;
                }
            })
            .addCase(joinChannel.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //delete channel
            .addCase(deleteChannel.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(deleteChannel.fulfilled, (state, action) => {
                state.pending = false;
                state.allChannels = state.allChannels.filter(
                    ch => ch.channelId !== action.payload.data.channelId
                );
                state.responseMessage = action.payload.message;
            })
            .addCase(deleteChannel.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //leave channel
            .addCase(leaveChannel.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(leaveChannel.fulfilled, (state, action) => {
                state.pending = false;
                const channelIndex = state.allChannels.findIndex(
                    ch => ch.channelId === action.meta.arg.channelId
                );
                if (channelIndex !== -1 && action.payload.data?.channel) {
                    state.allChannels[channelIndex] = action.payload.data.channel;
                }
            })
            .addCase(leaveChannel.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //kick out user
            .addCase(kickOutUser.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(kickOutUser.fulfilled, (state, action) => {
                state.pending = false;
                const channelIndex = state.allChannels.findIndex(
                    ch => ch.channelId === action.meta.arg.channelId
                );
                if (channelIndex !== -1) {
                    state.allChannels[channelIndex].participants =
                        state.allChannels[channelIndex].participants.filter(
                            p => p.user?.toString() !== action.payload.data.removedParticipant.user.toString()
                        );
                }
            })
            .addCase(kickOutUser.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //update role
            .addCase(updateRole.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.pending = false;
                const id = action.payload.data.user._id;
                const currRole = action.payload.data.user.role;
                const channelIndex = state.allChannels.findIndex(
                    ch => ch.channelId === action.meta.arg.channelId
                );
                if (channelIndex !== -1) {
                    const participantIndex = state.allChannels[channelIndex].participants.findIndex(
                        p => p.user?._id === id
                    );
                    if (participantIndex !== -1) {
                        state.allChannels[channelIndex].participants[participantIndex].role = currRole
                    }
                }
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //update channel
            .addCase(updateChannel.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(updateChannel.fulfilled, (state, action) => {
                state.pending = false;
                // Update channel details
                const channelIndex = state.allChannels.findIndex(
                    ch => ch.channelId === action.meta.arg.channelId
                );
                if (channelIndex !== -1 && action.payload.data?.channel) {
                    state.allChannels[channelIndex] = action.payload.data.channel;
                }
            })
            .addCase(updateChannel.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
            //save document
            .addCase(saveDocument.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(saveDocument.fulfilled, (state, action) => {
                state.pending = false;
                const channelIndex = state.allChannels.findIndex(
                    ch => ch.channelId === action.meta.arg.channelId
                );
                if (channelIndex !== -1 && action.payload.channel) {
                    state.allChannels[channelIndex].document = action.payload.channel.document;
                }
            })
            .addCase(saveDocument.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            }))
            //get document async thunk
            .addCase(getDocument.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(getDocument.fulfilled, (state, action) => {
                state.pending = false;
                state.document = action.payload;
            })
            .addCase(getDocument.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
})

export const { addNewChannel, clearError } = channelSlice.actions;
export default channelSlice.reducer