import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ProfileCard from '../Popups/ProfileCard';
import { IoMenu } from "react-icons/io5";

const Header = ({ onOpen }) => {
  const { authUser } = useSelector((state) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className='h-12 w-full pr-10 py-2 bg-zinc-200/30 dark:bg-zinc-800/30 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-end'>
      <button
        onClick={onOpen}
        className='px-3 lg:hidden block text-zinc-600 dark:text-zinc-500 hover:text-zinc-700/30 dark:hover:text-zinc-300/30 cursor-pointer'>
        <IoMenu className='text-xl md:text-2xl' />
      </button>
      <div className='h-full flex-1 flex items-center gap-2 md:ml-3'>
        <img className='h-4/5 md:h-full aspect-square' src="/studyBuddy.svg" alt="logo" />
        <h1 className='text-md md:text-lg'>
          STUDY<span className='text-emerald-500'>BUDDY</span>
        </h1>
      </div>
      <div className='h-full w-1/2 flex items-center justify-end'>
        <button onClick={() => setProfileOpen(true)} className='h-full cursor-pointer'>
          <img
            className='h-full aspect-square rounded-full'
            src={authUser?.profilePic || "/demo.png"}
            alt="dp"
          />
        </button>
      </div>
      <ProfileCard isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}

export default Header