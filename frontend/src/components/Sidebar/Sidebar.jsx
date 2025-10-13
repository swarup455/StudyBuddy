import React from 'react'
import { Link } from "react-router-dom"
import { GrHomeOption } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import { FaHashtag } from "react-icons/fa6";
import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { IoMdSettings } from "react-icons/io";
import ChannelAvatar from '../common/ChannelAvatar';
import useClickOutside from '../../customHooks/useClickOutside';
import { CreateChannel } from '../Popups/CreateChannel';

const Sidebar = () => {
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createChannelMenuOpen, setCreateChannelMenuOpen] = useState(false);
  const notify = () => toast.arguments("Create Collab clicked 🚀");
  const { authUser } = useSelector((state) => state.auth);
  const { allChannels } = useSelector((state) => state.channel);
  const menuRef = useClickOutside(() => setMenuOpen(false), menuOpen);

  return (
    <div className='h-screen w-full max-w-65 flex flex-col px-5 border-r border-zinc-400/30 dark:border-zinc-700/30 bg-zinc-100 dark:bg-zinc-900'>
      <div className='h-15 p-2 text-lg my-5 gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700/30  w-full flex items-center cursor-pointer overflow-hidden'>
        <Link to="/profile" className='h-full flex items-center gap-2 p-2 rounded-sm hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30'>
          <img className='h-full aspect-square rounded-full object-cover' src={authUser?.profilePic || "/demo.png"} alt="logo" />
          <span className='hidden sm:block dark:text-zinc-400'>{authUser?.fullName}</span>
        </Link>
        <Link to="/settings" className='group hidden sm:block text-zinc-600 hover:bg-zinc-200/30 dark:hover:bg-zinc-700/30 p-2 rounded-sm' >
          <IoMdSettings size={20} className='group-hover:[animation:spin_0.5s_ease-out_1]' />
        </Link>
      </div>
      <Link to={"/"} className='h-12 w-full flex items-center p-2 rounded-lg cursor-pointer border border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 hover:dark:border-zinc-700/30 hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30'>
        <div className='bg-violet-500 text-white p-3 rounded-full'>
          <GrHomeOption />
        </div>
        <span className='hidden sm:block px-3'>
          Home
        </span>
      </Link>
      <div className="relative">
        <button onClick={() => setRoomsOpen((prev) => !prev)} className='group h-12 w-full flex items-center p-2 rounded-lg cursor-pointer border border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 hover:dark:border-zinc-700/30 hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30'>
          {roomsOpen ? <IoIosArrowForward /> : <IoIosArrowDown />}
          <span className='px-3 w-full flex items-center justify-between'>
            <p className='hidden sm:block'>Study Collabs</p>
            <BsThreeDotsVertical
              size={25}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className='p-1 opacity-0 rounded-lg dark:text-zinc-500 group-hover:opacity-100 hover:border hover:bg-zinc-200/30 dark:hover:bg-zinc-700/30 hover:border-zinc-400 dark:hover:border-zinc-700/30' />
          </span>
        </button>
        {menuOpen && (
          <div ref={menuRef} className="absolute w-40 p-3 top-0 right-0 mt-2 rounded-xl bg-zinc-300 dark:bg-zinc-800 border border-zinc-300/30 dark:border-zinc-700/30 z-10">
            <button onClick={() => { setMenuOpen(false), setCreateChannelMenuOpen(true) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
              <span className='flex items-center justify-start gap-3'>
                <FaPlus className='text-zinc-400 dark:text-zinc-500' />
                Create Collab
              </span>
            </button>
            <button onClick={() => { setMenuOpen(false), notify() }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
              <span className='flex items-center justify-start gap-3'>
                <FaHashtag className='text-zinc-400 dark:text-zinc-500' />
                Join Collab
              </span>
            </button>
          </div>
        )}
      </div>
      <CreateChannel isOpen={createChannelMenuOpen} onClose={() => setCreateChannelMenuOpen(false)} />
      <ul className={`flex-1 overflow-y-auto ${roomsOpen ? "hidden" : "block"}`}>
        {allChannels.map((item) => (
          <li key={item.joinId}>
            <Link className='h-12 px-4 group py-2 flex items-center justify-between group cursor-pointer rounded-lg text-zinc-800 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 hover:dark:border-zinc-700/30 hover:bg-zinc-200/30 dark:hover:bg-zinc-800/30'
              to={`/study/${item.joinId}`}>
              <span className='flex items-center gap-3'>
                <ChannelAvatar name={item.channelName} />
                <p className='hidden sm:block'>{item.channelName}</p>
              </span>
              <BsThreeDotsVertical size={25} className='p-1 opacity-0 rounded-lg dark:text-zinc-500 group-hover:opacity-100 hover:border hover:bg-zinc-200/30 dark:hover:bg-zinc-700/30 hover:border-zinc-400 dark:hover:border-zinc-700/30' />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar