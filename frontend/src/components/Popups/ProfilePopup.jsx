import React from 'react'
import useClickOutside from '../../customHooks/useClickOutside';
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getMessages } from '../../reduxToolkit/chat/chatSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

const ProfilePopup = ({ isOpen, onClose, user }) => {
    const profileRef = useClickOutside(onClose, isOpen);
    const { messages } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(getMessages(user._id));
        }
    }, [dispatch, user])

    const media = messages.filter((item) => item.image);

    if (!isOpen) return null;
    return (
        <div className='flex items-center justify-center fixed inset-0 bg-black/30 z-50'>
            <div ref={profileRef} className='w-full h-2/3 sm:h-3/4 md:h-7/8 max-w-xl rounded-xl m-5 p-5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex flex-col gap-5'>
                <div className='w-full flex flex-col items-center'>
                    <img
                        className='w-1/4 aspect-square rounded-full ring-4 ring-violet-600 ring-offset-3 ring-offset-zinc-200 dark:ring-offset-zinc-800 mb-4'
                        src={user?.profilePic || "/demo.png"} alt="dp"
                    />
                    <p className='text-2xl font-semibold text-zinc-700 dark:text-zinc-200 mb-1'>
                        {user?.fullName}
                    </p>
                    <p className='text-sm text-zinc-500 dark:text-zinc-400 font-semibold mb-5'>
                        {user?.bio || "Hey , I am using StudyBuddyジ"}
                    </p>
                    <span className='flex items-center gap-3'>
                        <Link to={`/chat/${user._id}`} className='cursor-pointer'>
                            <BsFillChatSquareTextFill size={20} className='text-green-600' />
                        </Link>
                    </span>
                </div>
                {media &&
                    <div className='h-full w-full flex flex-col items-start'>
                        <h1 className='w-full text-xl font-semibold p-3 mb-3 border border-zinc-300 dark:border-zinc-800 rounded-lg bg-zinc-200/30 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-200'>
                            Media
                        </h1>
                        <ul className='flex-1 w-full overflow-y-auto grid gap-2 grid-cols-5 p-2 rounded-lg bg-zinc-800/30 border border-zinc-300 dark:border-zinc-800'>
                            {media?.map((media) => (
                                <li key={media?._id}>
                                    <img src={media?.image} className='w-full aspect-square rounded-md object-cover' alt="media" />
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProfilePopup