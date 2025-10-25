import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinChannel } from '../reduxToolkit/channel/channelSlice';
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner8 } from 'react-icons/im';
import { clearError } from '../reduxToolkit/channel/channelSlice';
import toast from "react-hot-toast";

const JoinChannelPage = () => {
    const { channelName, channelId } = useParams();
    const { pending, error } = useSelector((state) => state.channel);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleJoin = async () => {
        if (channelId) {
            await dispatch(joinChannel({ channelId })).unwrap();
            navigate(`/study/${channelId}`);
        }
    };

    useEffect(() => {
        if (error) {
            const message = typeof error === "string" ? error : error.message || "Something went wrong";
            toast.error(message);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    return (
        <div className="h-full p-5 flex flex-col lg:flex-row items-center justify-start lg:justify-center">
            <img className='w-full max-w-lg' src="/JoinChannel.svg" alt="vector" />
            <div className="p-5 rounded-xl w-full max-w-sm text-center border border-zinc-300 dark:border-zinc-800">
                <h1 className="text-2xl font-semibold mb-2">{channelName}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Channel ID: {channelId}
                </p>
                <button
                    onClick={handleJoin}
                    disabled={pending}
                    className="w-full p-3 bg-blue-600 text-white flex items-center justify-center gap-3 rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                >
                    {pending ? (
                        <>
                            <ImSpinner8 className="animate-spin" /> Joining...
                        </>
                    ) : (
                        "Join Channel"
                    )}
                </button>
            </div>
        </div>
    );
};

export default JoinChannelPage;