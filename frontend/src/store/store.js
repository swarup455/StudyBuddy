import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../reduxToolkit/auth/authSlice.js"
import chatReducer from "../reduxToolkit/chat/chatSlice.js"
import channelReducer from "../reduxToolkit/channel/channelSlice.js"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    channel: channelReducer
  }
})