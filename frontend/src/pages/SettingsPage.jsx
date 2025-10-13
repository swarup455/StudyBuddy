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

const SettingsPage = () => {
    const { setting } = useParams();
    const { themeMode, darkTheme, lightTheme } = useTheme();
    const [openLogout, setOpenLogout] = useState(false);

    return (
        <div className="flex flex-row h-screen w-full">
            <div className="h-screen w-1/3 border-r border-r-zinc-400/30 dark:border-r-zinc-700/30 px-5">
                <h1 className='text-2xl text-zinc-800 dark:text-zinc-300 font-semibold my-6'>Settings</h1>
                <Link
                    to="/settings/darkmode"
                    className='p-4 border border-zinc-300 dark:border-zinc-800 flex items-center justify-start gap-5 my-5 rounded-xl text-zinc-800 dark:text-zinc-300'>
                    <MdOutlineLightMode size={20} />
                    <p>Dark Mode</p>
                </Link>
                <button 
                onClick={() => setOpenLogout(true)}
                className='w-full p-4 border border-zinc-300 dark:border-zinc-800 flex items-center justify-start gap-5 my-5 rounded-xl text-red-500 cursor-pointer'>
                    <IoIosLogOut size={20} />
                    Log out
                </button>
            </div>
            <div className="h-screen w-2/3 px-5">
                {!setting &&
                    <div className='h-full w-full flex items-center justify-center'>
                        <TbMoodEmpty size={100} className='text-zinc-300 dark:text-zinc-800'/>
                    </div>
                }
                {setting === "darkmode" &&
                    <div className='h-full w-full'>
                        <h1 className='text-2xl text-zinc-800 dark:text-zinc-300 font-semibold my-6'>Dark Mode</h1>
                        <div className='w-full max-w-xl p-4 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between gap-5 my-5 rounded-xl text-zinc-600 dark:text-zinc-300 cursor-pointer'>
                            Dark Mode
                            {themeMode === "dark" ?
                                <FaToggleOn size={30} onClick={lightTheme} />
                                :
                                <FaToggleOff size={30} onClick={darkTheme} />
                            }
                        </div>
                    </div>
                }
            </div>
            <LogoutPopup isOpen={openLogout} onClose={() => setOpenLogout(false)}/>
        </div>
    )
}

export default SettingsPage