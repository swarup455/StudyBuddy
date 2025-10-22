import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "./authApi.js"
import toast from "react-hot-toast"
import { extractErrorMessage } from "../../../utils/errorHandler.js"

export const checkAuth = createAsyncThunk(
    "auth/checkAuth", async (_, { rejectWithValue, dispatch }) => {
        try {
            const userData = await api.get("/get-user");
            const user = userData.data.data;
            return user;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

export const loginAndSignupUser = createAsyncThunk(
    "auth/loginUser", async ({ state, userData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post(`/${state}`, userData);
            const user = response.data.data.user;
            return {state, user};
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout", async (_, { rejectWithValue}) => {
        try {
            await api.get("/logout");
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

export const updateProfile = createAsyncThunk(
    "auth/updateProfile", async (userData, { rejectWithValue }) => {
        try {
            const response = await api.put("/update-profile", userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        authUser: JSON.parse(localStorage.getItem("authUser")) || null,
        onlineUsers: [],
        isConnected: false,
        pending: false,
        error: null,
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //login or signup user
            .addCase(loginAndSignupUser.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(loginAndSignupUser.fulfilled, (state, action) => {
                state.pending = false;
                state.authUser = action.payload.user;
                localStorage.setItem("authUser", JSON.stringify(action.payload));
                if(action.payload.state === "login") toast.success("Logged in successfully!");
                else toast.success("Signed Up successfully!");
            })
            .addCase(loginAndSignupUser.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            //getting current user
            .addCase(checkAuth.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authUser = action.payload;
                state.pending = false;
                state.isConnected = true;
                localStorage.setItem("authUser", JSON.stringify(action.payload));
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
                localStorage.removeItem("authUser");
            })
            //logout
            .addCase(logout.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.authUser = null;
                state.onlineUsers = [];
                state.isConnected = false;
                state.pending = false;
                localStorage.removeItem("authUser");
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
                state.pending = false;
            })
            //update profile
            .addCase(updateProfile.pending, (state) => {
                state.pending = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.authUser = action.payload;
                state.pending = false;
                localStorage.setItem("authUser", JSON.stringify(action.payload));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload;
            })
    }
})

export const { setOnlineUsers, disconnectSocket } = authSlice.actions;
export default authSlice.reducer