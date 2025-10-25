import React, { useState } from 'react'
import { MdOutlineLightMode } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom"
import { useParams } from 'react-router-dom';
import { FaToggleOn } from "react-icons/fa6";
import { FaToggleOff } from "react-icons/fa6";
import useTheme from '../context/ThemeSwitcher';
import LogoutPopup from '../components/Popups/LogoutPopup';
import { TbMoodEmpty } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { useSelector } from 'react-redux';
import { TbEdit } from "react-icons/tb";
import ProfileEdit from '../components/Popups/ProfileEdit';
import { FaArrowLeft } from "react-icons/fa";

const SettingsPage = () => {
    const { setting } = useParams();
    const { themeMode, darkTheme, lightTheme } = useTheme();
    const [openLogout, setOpenLogout] = useState(false);
    const { authUser } = useSelector((state) => state.auth);
    const [profileEditOpen, setProfileEditOpen] = useState(false);

    return (
        <div className="flex flex-row h-full w-full overflow-hidden">
            <div className={`h-screen w-full md:w-1/3 ${setting ? "hidden" : "block"} md:block border-r border-r-zinc-400/30 dark:border-r-zinc-700/30 px-5 overflow-y-scroll`}>
                <h1 className='text-2xl text-zinc-800 dark:text-zinc-300 font-semibold my-6'>Settings</h1>
                <Link
                    to="/settings/profile"
                    className='p-4 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 border border-zinc-300 dark:border-zinc-800 flex items-center justify-start gap-5 my-5 rounded-xl text-zinc-800 dark:text-zinc-300'>
                    <CgProfile size={20} />
                    <p>Profile</p>
                </Link>
                <Link
                    to="/settings/darkmode"
                    className='p-4 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 border border-zinc-300 dark:border-zinc-800 flex items-center justify-start gap-5 my-5 rounded-xl text-zinc-800 dark:text-zinc-300'>
                    <MdOutlineLightMode size={20} />
                    <p>Dark Mode</p>
                </Link>
                <button
                    onClick={() => setOpenLogout(true)}
                    className='w-full p-4 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 border border-zinc-300 dark:border-zinc-800 flex items-center justify-start gap-5 my-5 rounded-xl text-red-500 cursor-pointer'>
                    <IoIosLogOut size={20} />
                    Log out
                </button>
            </div>
            <div className={`h-screen flex-1 ${setting ? "block" : "hidden"} md:block px-5 overflow-y-scroll scroll-smooth`}>
                {!setting &&
                    <div className='h-full w-full flex items-center justify-center'>
                        <TbMoodEmpty size={100} className='text-zinc-300 dark:text-zinc-800' />
                    </div>
                }
                {setting === "darkmode" &&
                    <div className='h-full w-full'>
                        <Link to="/settings" className='h-18 flex md:hidden items-center justify-start gap-3'>
                            <FaArrowLeft size={20} className='text-zinc-500 dark:text-zinc-500' />
                            <h1 className='text-xl md:text-2xl text-zinc-800 dark:text-zinc-300 font-semibold my-6'>Dark Mode</h1>
                        </Link>
                        <h1 className='hidden md:block text-2xl text-zinc-800 dark:text-zinc-300 font-semibold mt-6 mb-3 md:mb-6 '>Dark Mode</h1>
                        <div className='w-full max-w-xl p-4 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between gap-5 my-3 md:my-5 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer'>
                            Dark Mode
                            {themeMode === "dark" ?
                                <FaToggleOn size={30} onClick={lightTheme} />
                                :
                                <FaToggleOff size={30} onClick={darkTheme} />
                            }
                        </div>
                    </div>
                }
                {setting === "profile" &&
                    <div className='h-full w-full'>
                        <Link to="/settings" className='h-18 flex md:hidden items-center justify-start gap-3'>
                            <FaArrowLeft size={20} className='text-zinc-500 dark:text-zinc-500' />
                            <h1 className='text-xl md:text-2xl text-zinc-800 dark:text-zinc-300 font-semibold my-6'>Profile</h1>
                        </Link>
                        <h1 className='hidden md:block text-2xl text-zinc-800 dark:text-zinc-300 font-semibold mt-6 mb-3 md:mb-6 '>Profile</h1>
                        <div className='w-full max-w-xl p-4 border border-zinc-300 dark:border-zinc-800 flex items-start justify-between gap-2 my-5 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer'>
                            Profile picture
                            <img className='h-20 aspect-square rounded-full' src={authUser?.profilePic || "/demo.png"} alt="" />
                        </div>
                        <div className='w-full max-w-xl p-4 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between gap-5 my-5 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer'>
                            Full name
                            <p>{authUser?.fullName}</p>
                        </div>
                        <div className='w-full max-w-xl p-4 border border-zinc-300 dark:border-zinc-800 flex flex-col items-start justify-between gap-2 my-5 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer'>
                            About
                            <p className='text-sm'>{authUser?.bio || "Heyy, I am using studyBuddyッ"}</p>
                        </div>
                        <div onClick={() => setProfileEditOpen(true)} className='w-full max-w-xl p-4 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 border border-zinc-300 dark:border-zinc-800 flex items-start justify-between gap-2 my-5 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer'>
                            Edit Profile
                            <TbEdit size={23} />
                        </div>
                    </div>
                }
            </div>
            <LogoutPopup isOpen={openLogout} onClose={() => setOpenLogout(false)} />
            <ProfileEdit isOpen={profileEditOpen} onClose={() => setProfileEditOpen(false)} />
        </div>
    )
}

export default SettingsPage