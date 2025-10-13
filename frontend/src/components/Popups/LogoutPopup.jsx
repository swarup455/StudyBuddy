import React from 'react'
import { IoIosLogOut } from "react-icons/io";
import { logout } from '../../reduxToolkit/auth/authSlice';
import { useDispatch } from "react-redux"
import useClickOutside from '../../customHooks/useClickOutside';

const LogoutPopup = ({ isOpen, onClose }) => {
    const containerRef = useClickOutside(onClose, isOpen);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
    }

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div ref={containerRef} className='w-full max-w-sm flex flex-col items-center gap-5 p-10 rounded-xl m-5 border border-zinc-400/50 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900'>
                <IoIosLogOut size={80} className='text-zinc-400 dark:text-zinc-800' />
                <p className='text-xl text-zinc-800 dark:text-zinc-300 font-semibold'>Oh no! You're leaving...</p>
                <p className='text-zinc-600 dark:text-zinc-500 font-semibold'>Are you sure you want to log out?</p>
                <button
                    className='w-full bg-violet-500 font-semibold p-3 text-white rounded-full cursor-pointer'
                    onClick={onClose}>
                    Naah, Just Kidding
                </button>
                <button
                    onClick={handleLogout}
                    className='w-full border-3 border-violet-500 p-3 text-violet-600 dark:text-zinc-200 font-semibold rounded-full cursor-pointer'>
                    Yes, Log Me Out
                </button>
            </div>
        </div>
    )
}

export default LogoutPopup