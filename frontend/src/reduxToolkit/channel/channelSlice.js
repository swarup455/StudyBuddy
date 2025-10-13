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

const channelSlice = createSlice({
    name: "channel",
    initialState: {
        allChannels: [],
        pending: false,
        error: null
    },
    reducers: {
        addNewChannel: (state, action) => {
            state.allChannels = [action.payload, ...state.allChannels];
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
    )
})

export const { addNewChannel } = channelSlice.actions;
export default channelSlice.reducer