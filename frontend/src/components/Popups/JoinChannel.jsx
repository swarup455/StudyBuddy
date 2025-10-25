import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { joinChannel } from '../../reduxToolkit/channel/channelSlice';
import { ImSpinner8 } from 'react-icons/im';
import { clearError } from '../../reduxToolkit/channel/channelSlice';
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from '../../customHooks/useClickOutside';

export const JoinChannel = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pending, error } = useSelector((state) => state.channel);
    const [channelId, setChannelId] = useState("");
    const joinRef = useClickOutside(onClose, isOpen);

    const handleJoinChannel = async (e) => {
        e.preventDefault();
        if (!channelId.trim()) {
            toast.error("Channel Id is required");
            return;
        }
        try {
            const result = await dispatch(joinChannel({ channelId })).unwrap();
            toast.success(`You joined "${result.channel.channelName}" collab!`);
            navigate(`/study/${result.channel.channelId}`);
            onClose();
        } catch (error) {
            if (error.isAlreadyMember) {
                toast.success("You're already in this collab!");
                navigate(`/study/${error.channelId}`);
                onClose();
            } else {
                toast.error(error.message || "Failed to join channel");
            }
        }
        setChannelId("");
        dispatch(clearError());
    };

    return (
        <AnimatePresence>
            {isOpen &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex items-center justify-center fixed inset-0 z-50 bg-black/20'
                >
                    <motion.div
                        ref={joinRef}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className='w-full max-w-md shadow-md border border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-200 dark:bg-zinc-900 px-8 relative'
                    >
                        <h1 className='w-full text-center text-2xl font-semibold text-zinc-700 dark:text-zinc-300 my-8'>Join Collab</h1>
                        <form onSubmit={handleJoinChannel}>
                            <p className='w-full text-center my-3 text-sm font-semibold text-zinc-400 dark:text-zinc-500'>
                                Enter channel Id to join that collab!
                            </p>
                            <input
                                type="text"
                                value={channelId}
                                onChange={(e) => setChannelId(e.target.value)}
                                placeholder='Channel Id'
                                className='w-full p-4 rounded-xl border border-zinc-300 dark:border-zinc-800 focus:outline-none 
                        hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30'
                            />
                            <button
                                type="submit"
                                className='w-full bg-violet-600 hover:bg-indigo-700 p-4 cursor-pointer rounded-xl my-10 flex items-center justify-center gap-2'>
                                {pending && <ImSpinner8 className='animate-spin' />}
                                Join Collab
                            </button>
                            {error && <p className="w-full text-center text-sm text-red-500 my-5">{error.message}</p>}
                        </form>
                        <RxCross1
                            onClick={onClose}
                            className='text-zinc-400 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-500 cursor-pointer absolute top-5 right-5'
                        />
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}