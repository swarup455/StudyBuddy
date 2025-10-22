import React from 'react'
import { useSelector } from "react-redux"

const ProfilePage = () => {
  const { authUser } = useSelector((state) => state.auth);
  
  return (
    <div className='w-full max-w-2/3 p-5'>
      <div className='w-full rounded-2xl border border-zinc-300 dark:border-zinc-800 p-10'>
        <div className='w-full'>
          <img
            className='max-h-40 aspect-square rounded-full ring-4 ring-violet-500 ring-offset-zinc-100 dark:ring-offset-zinc-900 ring-offset-2'
            src={authUser?.profilePic || "/demo.png"} alt="profile photo" />
        </div>
        <div className='w-full space-y-3 my-5'>
          <p className='text-3xl text-zinc-700 dark:text-zinc-300 font-semibold'>{authUser?.fullName}</p>
          <p className='text-[17px] font-semibold text-zinc-500'>{authUser?.bio || "Hey dude , I am using Studdy Buddy"}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage