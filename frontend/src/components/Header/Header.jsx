import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ProfileCard from '../Popups/ProfileCard';

const Header = () => {
  const { authUser } = useSelector((state) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className='h-12 w-full px-10 py-2 bg-zinc-200/30 dark:bg-zinc-800/30 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-end'>
      <button onClick={() => setProfileOpen(true)} className='h-full cursor-pointer'>
        <img
          className='h-full aspect-square rounded-full'
          src={authUser?.profilePic || "/demo.png"}
          alt="dp"
        />
      </button>
      <ProfileCard isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}

export default Header