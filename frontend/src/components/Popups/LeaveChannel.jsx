import React, { useState } from 'react'
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux"
import useClickOutside from '../../customHooks/useClickOutside';
import { leaveChannel } from '../../reduxToolkit/channel/channelSlice';
import { useNavigate } from "react-router-dom"
import { CgSpinner } from 'react-icons/cg';

const LeaveChannel = ({ isOpen, onClose, channel }) => {
    const { authUser } = useSelector((state) => state.auth);
    const { pending } = useSelector((state) => state.channel);
    const containerRef = useClickOutside(onClose, isOpen);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newAdmin, setNewAdmin] = useState("");

    const isAdmin = channel.channelAdmin._id === authUser._id;
    let eligibleMembers = [];
    if (channel && channel.participants?.length > 0) {
        eligibleMembers = channel.participants.filter(
            (item) => item.user._id !== channel.channelAdmin._id
        );
    }
    const handleLeave = () => {
        if (!channel) return;
        let userData = {};
        if (isAdmin && newAdmin) {
            userData.newAdminId = newAdmin;
        }
        dispatch(leaveChannel({ userData, channelId: channel.channelId }));
        if(!pending){
            onClose();
            navigate("/");
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div ref={containerRef} className='w-full max-w-sm flex flex-col items-center gap-5 p-10 rounded-xl m-5 border border-zinc-400/50 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900'>
                <IoIosLogOut size={80} className='text-zinc-400 dark:text-zinc-800' />
                <p className='text-xl text-zinc-800 dark:text-zinc-300 font-semibold'>Oh no! You're leaving...</p>
                <p className='text-zinc-600 dark:text-zinc-500 font-semibold text-sm'>Are you sure you want to leave this channel?</p>
                {isAdmin ?
                    <select
                        className="w-full p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 focus:outline-none"
                        value={newAdmin}
                        onChange={(e) => setNewAdmin(e.target.value)}
                    >
                        <option value="">-- Select new admin --</option>
                        {eligibleMembers?.map((item) => (
                            <option key={item?.user?._id} value={item?.user?._id}>
                                {item?.user?.fullName}
                            </option>
                        ))}
                    </select>
                    :
                    <button onClick={onClose}
                        className='w-full bg-violet-500 font-semibold p-3 text-white rounded-full cursor-pointer'>
                        Nahh, Just jocking!
                    </button>
                }
                <button
                    onClick={handleLeave}
                    className='w-full border-3 border-violet-500 p-3 text-violet-600 dark:text-zinc-200 font-semibold flex items-center gap-2 justify-center rounded-full cursor-pointer'>
                    {pending && <CgSpinner size={20} className='text-violet-500 animate-spin'/>}
                    Yes, Leave this channel!
                </button>
            </div>
        </div>
    )
}

export default LeaveChannel
