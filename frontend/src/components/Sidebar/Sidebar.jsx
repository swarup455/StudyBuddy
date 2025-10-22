import React from 'react'
import { Link } from "react-router-dom"
import { GrHomeOption } from "react-icons/gr";
import { FaHashtag } from "react-icons/fa6";
import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux"
import { IoMdSettings } from "react-icons/io";
import ChannelAvatar from '../common/ChannelAvatar';
import useClickOutside from '../../customHooks/useClickOutside';
import { CreateChannel } from '../Popups/CreateChannel';
import { JoinChannel } from '../Popups/JoinChannel';
import { FiPlusCircle } from "react-icons/fi";

const Sidebar = () => {
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createChannelMenuOpen, setCreateChannelMenuOpen] = useState(false);
  const [joinChannelMenuOpen, setJoinChannelMenuOpen] = useState(false);
  const { authUser } = useSelector((state) => state.auth);
  const { allChannels } = useSelector((state) => state.channel);
  const menuRef = useClickOutside(() => setMenuOpen(false), menuOpen);

  return (
    <div className='h-screen w-12 sm:w-20 px-1 sm:px-3 flex flex-col border-r border-zinc-400/30 dark:border-zinc-700/30 bg-zinc-100 dark:bg-zinc-900 relative'>
      <Link to="/" className='my-5'>
        <div className='w-full aspect-square bg-violet-500 text-white flex items-center justify-center overflow-hidden rounded-full'>
          <GrHomeOption />
        </div>
      </Link>
      <CreateChannel isOpen={createChannelMenuOpen} onClose={() => setCreateChannelMenuOpen(false)} />
      <JoinChannel isOpen={joinChannelMenuOpen} onClose={() => setJoinChannelMenuOpen(false)} />
      <ul className="flex-1 py-5 border-t border-zinc-300 dark:border-zinc-800 overflow-y-auto">
        <button onClick={() => setMenuOpen(true)} className='w-full cursor-pointer'>
          <div className='w-full aspect-square bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center overflow-hidden rounded-full'>
            <FiPlusCircle size={20} />
          </div>
        </button>
        {allChannels.map((item) => (
          <li key={item.channelId} className='my-3'>
            <Link to={`/study/${item.channelId}`}>
              <ChannelAvatar channel={item} />
            </Link>
          </li>
        ))}
      </ul>
      {menuOpen && (
        <div ref={menuRef} className="absolute w-40 p-3 md:top-35 top-30 md:left-15 left-10 mt-2 rounded-xl bg-zinc-300 dark:bg-zinc-800 border border-zinc-300/30 dark:border-zinc-700/30 z-10">
          <button onClick={() => { setMenuOpen(false), setCreateChannelMenuOpen(true) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
            <span className='flex items-center justify-start gap-3'>
              <FaPlus className='text-zinc-400 dark:text-zinc-500' />
              Create Collab
            </span>
          </button>
          <button onClick={() => { setMenuOpen(false), setJoinChannelMenuOpen(true) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
            <span className='flex items-center justify-start gap-3'>
              <FaHashtag className='text-zinc-400 dark:text-zinc-500' />
              Join Collab
            </span>
          </button>
        </div>
      )}
      <Link to="/settings" className='w-full cursor-pointer my-5'>
        <div className='w-full aspect-square bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center overflow-hidden rounded-full'>
          <IoMdSettings size={20} />
        </div>
      </Link>
    </div>
  )
}

export default Sidebar