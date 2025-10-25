import React, { useEffect, useState, useRef } from 'react'
import { MdEdit } from "react-icons/md";
import useClickOutside from '../../customHooks/useClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import { updateChannel, updateChannelLogo } from '../../reduxToolkit/channel/channelSlice';
import toast from 'react-hot-toast';
import { ImSpinner8 } from "react-icons/im";
import { IoIosLogOut } from "react-icons/io";
import LeaveChannel from '../Popups/LeaveChannel';
import ShareChannel from '../common/ShareChannel';
import { IoLinkOutline } from "react-icons/io5";

const Channel = ({ channel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [channelNameEdit, setChannelNameEdit] = useState(false);
  const [channelAboutEdit, setChannelAboutEdit] = useState(false);
  const [channelName, setChannelName] = useState(channel?.channelName);
  const [channelAbout, setChannelAbout] = useState(channel?.channelAbout || "");
  const [remainingWords, setRemainingWords] = useState(20);
  const [aboutRemainingWords, setAboutRemainingWords] = useState(100);
  const dispatch = useDispatch();
  const { pending, error } = useSelector((state) => state.channel);
  const textareaRef = useRef(null);
  const [openLeaveChannel, setOpenLeaveChannel] = useState(false);
  const [shareLinkOpen, setShareLinkOpen] = useState(false);

  //close logo edit menu when click outside
  const editRef = useClickOutside(() => setOpenEditMenu(false), openEditMenu);

  //close input bar of name when click outside
  const channelNameEditRef = useClickOutside(() => {
    setChannelNameEdit(false);
    setChannelName(channel?.channelName);
  }, channelNameEdit);

  //close input bar of about when click outside
  const channelNameAboutRef = useClickOutside(() => {
    setChannelAboutEdit(false);
    setChannelAbout(channel?.channelAbout);
  }, channelAboutEdit);

  //function to save channel name
  const handleSaveChannelName = (name) => {
    dispatch(updateChannel({
      channelData: { channelName: name },
      channelId: channel.channelId
    })
    );
  }

  //function to save channel about
  const handleSaveChannelAbout = (about) => {
    dispatch(updateChannel({
      channelData: { channelAbout: about },
      channelId: channel.channelId
    })
    );
  }

  //function to save channel logo
  const handleSaveChannelLogo = (file) => {
    const formData = new FormData();
    formData.append('channelLogo', file);

    dispatch(updateChannelLogo({
      channelLogo: formData,
      channelId: channel.channelId
    }));
  };

  //set remaining words when channel name changes
  useEffect(() => {
    setRemainingWords(Math.max(20 - channelName?.length, 0));
  }, [channelName]);

  //set remaining words when channel about changes
  useEffect(() => {
    setAboutRemainingWords(Math.max(100 - channelAbout?.length, 0));
  }, [channelAbout]);

  //when channel name actually updates close the input bar
  useEffect(() => {
    setChannelNameEdit(false);
  }, [channel?.channelName]);

  //when channel about actually changes close input bar
  useEffect(() => {
    setChannelAboutEdit(false);
  }, [channel.channelAbout]);

  //for error
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  //increse height of textarea when legth of about exceeds
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [channelAbout, channelAboutEdit]);

  const currRef = useClickOutside(() => setShareLinkOpen(false), shareLinkOpen);
  return (
    <div className='w-full flex-1 flex flex-col gap-5 items-center justify-start overflow-y-scroll'>
      <div className='w-full bg-zinc-300/30 dark:bg-zinc-950/30 flex flex-col items-center justify-start text-center
       px-5 py-10 rounded-xl border border-zinc-200 dark:border-zinc-800'>
        <div
          ref={editRef}
          className='relative w-1/3 md:w-1/4 aspect-square mb-4'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          <img
            className='w-full aspect-square rounded-full object-cover ring-4 ring-offset-3 ring-violet-500 ring-offset-zinc-100 dark:ring-offset-zinc-900 transition-all'
            src={channel.channelLogo || "/channel.svg"}
            alt="channel"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!openEditMenu) setOpenEditMenu(true);
            }}
            className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center
              transition-opacity duration-200 cursor-pointer ${isHovered && !openEditMenu ? 'opacity-100' : 'opacity-0'}`}>
            <MdEdit className='text-zinc-700 dark:text-zinc-300' />
          </div>
          <div
            className={`flex flex-col items-center p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900
            rounded-lg absolute left-1/2 -translate-x-1/2 mt-4 transition-all duration-300 origin-top
            ${openEditMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <button className='whitespace-nowrap hover:text-violet-500 transition-colors hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 p-2 rounded-sm cursor-pointer'>
              Remove Image
            </button>
            <label onClick={() => setOpenEditMenu(false)} htmlFor='selectImage' className='whitespace-nowrap hover:text-violet-500 transition-colors hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 p-2 rounded-sm cursor-pointer'>
              Change Image
            </label>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleSaveChannelLogo(file);
                }
              }}
              id='selectImage'
              type="file"
              className='hidden'
              accept="image/*" />
          </div>
        </div>
        {channelNameEdit ?
          <div ref={channelNameEditRef} className='flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded-sm mb-3 overflow-hidden'>
            <input
              value={channelName}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  setChannelName(e.target.value);
                }
              }}
              type='text'
              className='focus:outline-none px-1 sm:px-3'
            />
            <button
              onClick={() => handleSaveChannelName(channelName)}
              className="h-8 sm:h-10 w-10 sm:w-15 bg-violet-600 flex items-center justify-center text-sm group text-white cursor-pointer">
              {pending ?
                <ImSpinner8 className='animate-spin' />
                :
                <div>
                  <p className="block group-hover:hidden">{remainingWords}</p>
                  <p className="hidden group-hover:block">Save</p>
                </div>
              }
            </button>
          </div>
          :
          <p className='w-full text-lg sm:text-xl md:text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center justify-center gap-1'>
            {channel?.channelName}
            <button
              onClick={() => {
                setChannelNameEdit(true);
                setChannelAboutEdit(false);
              }}
              className='hover:bg-zinc-300/30 dark:hover:bg-zinc-800/30 p-1 rounded-md border border-transparent hover:border-zinc-200 
           hover:dark:border-zinc-800 cursor-pointer'>
              <MdEdit size={15} />
            </button>
          </p>
        }
        {channelAboutEdit ?
          <div ref={channelNameAboutRef} className='w-2/3 flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded-sm mb-3 overflow-hidden'>
            <textarea
              ref={textareaRef}
              value={channelAbout}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setChannelAbout(e.target.value)
                }
              }}
              className='w-full focus:outline-none bg-transparent p-3 resize-none overflow-hidden min-h-[24px] max-h-[120px]'
              rows={1}
            />
            <button
              onClick={() => handleSaveChannelAbout(channelAbout)}
              className="h-8 sm:h-10 w-10 sm:w-15 bg-violet-600 flex items-center justify-center text-sm group text-white cursor-pointer rounded-sm">
              {pending ?
                <ImSpinner8 className='animate-spin' />
                :
                <div>
                  <p className="block group-hover:hidden">{aboutRemainingWords}</p>
                  <p className="hidden group-hover:block">Save</p>
                </div>
              }
            </button>
          </div>
          :
          <p className='w-full text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1'>
            {channel?.channelAbout || "Keep studing using StudyBuddy✨"}
            <button
              onClick={() => {
                setChannelAboutEdit(true);
                setChannelNameEdit(false);
              }}
              className='hover:bg-zinc-300/30 dark:hover:bg-zinc-800/30 p-1 rounded-md border border-transparent hover:border-zinc-200 
          hover:dark:border-zinc-800 cursor-pointer'>
              <MdEdit size={15} />
            </button>
          </p>
        }
      </div>
      <div
        onClick={() => setShareLinkOpen(true)}
        ref={currRef}
        className='relative w-full p-3 md:p-6 flex items-center gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 
        dark:hover:bg-zinc-950/10 rounded-lg md:rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-100 cursor-pointer'>
        <p className='flex-1'>Invite people to this collab via link</p>
        <IoLinkOutline size={20} />
        <ShareChannel isOpen={shareLinkOpen} onClose={() => setShareLinkOpen(false)} channel={channel} />
      </div>
      <div onClick={() => setOpenLeaveChannel(true)} className='w-full p-3 md:p-6 flex items-center gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 
        dark:hover:bg-zinc-950/10 rounded-lg md:rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-red-500 cursor-pointer'>
        <p className='flex-1'>Leave Channel</p>
        <IoIosLogOut size={20} />
      </div>
      <LeaveChannel isOpen={openLeaveChannel} onClose={() => setOpenLeaveChannel(false)} channel={channel} />
    </div>
  )
}

export default Channel