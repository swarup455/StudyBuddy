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
import { motion, AnimatePresence } from "framer-motion";
import { CreateChannel } from '../Popups/CreateChannel';
import { JoinChannel } from '../Popups/JoinChannel';
import { FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const Sidebar = ({ isOpen, onClose }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createChannelMenuOpen, setCreateChannelMenuOpen] = useState(false);
  const [joinChannelMenuOpen, setJoinChannelMenuOpen] = useState(false);
  const { allChannels } = useSelector((state) => state.channel);
  const menuRef = useClickOutside(() => setMenuOpen(false), menuOpen);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] // cubic-bezier for smooth professional feel
      }
    },
    closed: {
      x: "-100%",
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    },
  };

  const backdropVariants = {
    open: { opacity: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      {/* Backdrop - only on mobile when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={onClose}
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - always visible on lg+, no animation */}
      <aside className='hidden lg:flex h-screen w-64 sm:w-72 px-3 flex-col border-r border-zinc-400/30 dark:border-zinc-700/30 bg-zinc-100 dark:bg-zinc-900'>
        <Link to="/" className='h-15 p-2 my-5 flex items-center gap-3 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
          <div className='h-full aspect-square bg-violet-500 text-white flex items-center justify-center overflow-hidden rounded-full'>
            <GrHomeOption />
          </div>
          <p>Home</p>
        </Link>
        <CreateChannel isOpen={createChannelMenuOpen} onClose={() => setCreateChannelMenuOpen(false)} />
        <JoinChannel isOpen={joinChannelMenuOpen} onClose={() => setJoinChannelMenuOpen(false)} />
        <ul className="flex-1 py-5 border-t border-zinc-300 dark:border-zinc-800 overflow-y-auto">
          <p className='text-sm font-semibold text-zinc-400 dark:text-zinc-500 mx-3 my-1'>All channels</p>
          <button onClick={() => setMenuOpen(true)} className='h-15 p-2 w-full cursor-pointer flex items-center gap-3 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
            <div className='h-full aspect-square bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center overflow-hidden rounded-full'>
              <FiPlusCircle size={20} />
            </div>
            <p>New Channel</p>
          </button>
          {allChannels.map((item) => (
            <li key={item.channelId} className='h-15 p-2 my-3 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
              <Link className='h-full flex items-center gap-3' to={`/study/${item.channelId}`}>
                <ChannelAvatar channel={item} />
                <p>{item?.channelName}</p>
              </Link>
            </li>
          ))}
        </ul>
        {menuOpen && (
          <div ref={menuRef} className="absolute w-40 p-3 md:top-35 top-30 md:left-15 left-10 mt-2 rounded-xl bg-zinc-300 dark:bg-zinc-800 border border-zinc-300/30 dark:border-zinc-700/30 z-10">
            <button onClick={() => { setMenuOpen(false); setCreateChannelMenuOpen(true); }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
              <span className='flex items-center justify-start gap-3'>
                <FaPlus className='text-zinc-400 dark:text-zinc-500' />
                Create Collab
              </span>
            </button>
            <button onClick={() => { setMenuOpen(false); setJoinChannelMenuOpen(true); }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
              <span className='flex items-center justify-start gap-3'>
                <FaHashtag className='text-zinc-400 dark:text-zinc-500' />
                Join Collab
              </span>
            </button>
          </div>
        )}
        <Link to="/settings" className='w-full flex items-center gap-3 cursor-pointer h-15 p-2 my-5 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
          <div className='h-full aspect-square bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center overflow-hidden rounded-full'>
            <IoMdSettings size={20} />
          </div>
          <p>Settings</p>
        </Link>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className='fixed top-0 left-0 h-screen w-64 sm:w-72 px-3 flex flex-col border-r border-zinc-400/30 dark:border-zinc-700/30 bg-zinc-100 dark:bg-zinc-900 z-40 lg:hidden'
          >
            <Link to="/" className='h-15 p-2 my-5 flex items-center gap-3 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
              <div onClick={onClose} className='h-full aspect-square bg-violet-500 text-white flex items-center justify-center overflow-hidden rounded-full'>
                <GrHomeOption />
              </div>
              <p>Home</p>
            </Link>
            <CreateChannel isOpen={createChannelMenuOpen} onClose={() => setCreateChannelMenuOpen(false)} />
            <JoinChannel isOpen={joinChannelMenuOpen} onClose={() => setJoinChannelMenuOpen(false)} />
            <ul className="flex-1 py-5 border-t border-zinc-300 dark:border-zinc-800 overflow-y-auto">
              <p className='text-sm font-semibold text-zinc-400 dark:text-zinc-500 mx-3 my-1'>All channels</p>
              <button onClick={() => {setMenuOpen(true), onClose}} className='h-15 p-2 w-full cursor-pointer flex items-center gap-3 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
                <div className='h-full aspect-square bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center overflow-hidden rounded-full'>
                  <FiPlusCircle size={20} />
                </div>
                <p>New Channel</p>
              </button>
              {allChannels.map((item) => (
                <li onClick={onClose} key={item.channelId} className='h-15 p-2 my-3 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
                  <Link className='h-full flex items-center gap-3' to={`/study/${item.channelId}`}>
                    <ChannelAvatar channel={item} />
                    <p>{item?.channelName}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {menuOpen && (
              <div ref={menuRef} className="absolute w-40 p-3 md:top-35 top-30 md:left-15 left-10 mt-2 rounded-xl bg-zinc-300 dark:bg-zinc-800 border border-zinc-300/30 dark:border-zinc-700/30 z-10">
                <button onClick={() => { setMenuOpen(false); setCreateChannelMenuOpen(true); }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
                  <span className='flex items-center justify-start gap-3'>
                    <FaPlus className='text-zinc-400 dark:text-zinc-500' />
                    Create Collab
                  </span>
                </button>
                <button onClick={() => { setMenuOpen(false); setJoinChannelMenuOpen(true); }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
                  <span className='flex items-center justify-start gap-3'>
                    <FaHashtag className='text-zinc-400 dark:text-zinc-500' />
                    Join Collab
                  </span>
                </button>
              </div>
            )}
            <Link to="/settings" className='w-full flex items-center gap-3 cursor-pointer h-15 p-2 my-5 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 rounded-lg'>
              <div onClick={onClose} className='h-full aspect-square bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center overflow-hidden rounded-full'>
                <IoMdSettings size={20} />
              </div>
              <p>Settings</p>
            </Link>
            <button
              onClick={onClose}
              className='absolute top-3 right-4 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 cursor-pointer'>
              <RxCross2 size={20} />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar