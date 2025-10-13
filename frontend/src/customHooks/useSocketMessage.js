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
            if (newMessage.senderId !== authUser._id) {
                if (selectedUser && newMessage.senderId === selectedUser?._id) {
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

export const useSocketChannelMessages = (activeChannelId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleChannelMessage = async (newMessage) => {
            if (activeChannelId && newMessage.channelId === activeChannelId) {
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
        };
    }, [activeChannelId, dispatch]);
};