import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const Header = () => {
  const { authUser } = useSelector((state) => state.auth);

  return (
    <div className='h-12 w-full px-10 py-2 bg-zinc-200/30 dark:bg-zinc-800/30 border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-end'>
      <Link className='h-full cursor-pointer' to="/profile">
        <img
          className='h-full aspect-square rounded-full'
          src={authUser?.profilePic || "/demo.png"}
          alt="dp"
        />
      </Link>
    </div>
  )
}

export default Header
