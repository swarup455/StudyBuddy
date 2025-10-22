import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../../utils/socket';
import { addNewMessage, incrementUnseenCount } from '../reduxToolkit/chat/chatSlice';
import api from '../reduxToolkit/chat/chatApi';

export const useSocketMessages = (selectedUser) => {
    const dispatch = useDispatch();
    const { authUser } = useSelector((state) => state.auth);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = async (newMessage) => {
            if (newMessage.senderId._id !== authUser._id) {
                if (selectedUser && newMessage.senderId._id === selectedUser?._id) {
                    dispatch(addNewMessage(newMessage));
                    await api.put(`/mark/${newMessage._id}`);
                } else {
                    dispatch(incrementUnseenCount(newMessage.senderId));
                }
            }
        };
        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [selectedUser, dispatch]);
};

export const useSocketChannelMessages = ({channelId, authUser}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.emit("joinChannel", { channelId: channelId, user: authUser });
        const handleChannelMessage = async (newMessage) => {
            if (channelId && newMessage.channelId.channelId === channelId) {
                dispatch(addNewMessage(newMessage));
                try {
                    await api.put(`/mark/${newMessage._id}`);
                } catch (error) {
                    console.error('Failed to mark message as seen:', error);
                }
            } else {
                dispatch(incrementUnseenCount(newMessage.senderId));
            }
        };
        socket.on("newChannelMessage", handleChannelMessage);

        return () => {
            socket.off("newChannelMessage", handleChannelMessage);
            socket.emit("leaveChannel", { channelId: channelId, user: authUser });
        };
    }, [channelId, authUser, dispatch]);
};