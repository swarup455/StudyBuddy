import React, { useEffect } from 'react'
import useClickOutside from '../../customHooks/useClickOutside';
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { deleteChannel } from '../../reduxToolkit/channel/channelSlice';
import { clearError } from '../../reduxToolkit/channel/channelSlice';
import { CgSpinner } from 'react-icons/cg';
import toast from "react-hot-toast";

const DeleteChannel = ({ isOpen, onClose, channelId }) => {
    const containerRef = useClickOutside(onClose, isOpen);
    const { pending, error } = useSelector((state) => state.channel);
    const dispatch = useDispatch();
    
    const handleDeleteChannel = () => {
        if(channelId){
            dispatch(deleteChannel(channelId));
        }
    }
    useEffect(() => {
        if(error) toast.error(error);
        dispatch(clearError());
    }, [error])

    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div ref={containerRef} className='w-full max-w-sm flex flex-col items-center gap-5 p-10 rounded-xl m-5 border border-zinc-400/50 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900'>
                <MdDeleteOutline size={80} className='text-zinc-400 dark:text-zinc-800' />
                <p className='text-xl text-zinc-800 dark:text-zinc-300 font-semibold'>Delete channel</p>
                <p className='text-zinc-600 dark:text-zinc-500 font-semibold text-sm'>Are you sure you want to delete this channel?</p>
                <button onClick={onClose}
                    className='w-full bg-violet-500 font-semibold p-3 text-white rounded-full cursor-pointer'>
                    Nahh, Just jocking!
                </button>
                <button
                    onClick={handleDeleteChannel}
                    className='w-full border-3 border-violet-500 p-3 text-violet-600 dark:text-zinc-200 font-semibold flex items-center gap-2 justify-center rounded-full cursor-pointer'>
                    {pending && <CgSpinner size={20} className='text-violet-500 animate-spin' />}
                    Yes, Delete this channel!
                </button>
            </div>
        </div>
    )
}

export default DeleteChannel