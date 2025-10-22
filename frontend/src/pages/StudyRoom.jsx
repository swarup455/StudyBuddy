import React, { useState } from 'react'
import { FaArrowLeft, FaPlus } from 'react-icons/fa6';
import { useRef, useEffect } from 'react';
import { SimpleEditor } from '.././@/components/tiptap-templates/simple/simple-editor.jsx';
import { IoSend } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Message from '../components/message/Message.jsx';
import ChannelPopup from '../components/Popups/ChannelPopup.jsx';
import { useSocketChannelMessages } from '../customHooks/useSocketMessage.js';
import { getChannelMessages, sendMessageToChannel } from '../reduxToolkit/chat/chatSlice.js';
import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket"
import { getDocument } from '../reduxToolkit/channel/channelSlice.js';
import { ImSpinner8 } from 'react-icons/im';
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import ProfilePopup from '../components/Popups/ProfilePopup.jsx';

const StudyRoom = () => {
  const [text, setText] = useState();
  const [image, setImage] = useState();
  const [chatsOpen, setChatsOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const { allChannels } = useSelector((state) => state.channel);
  const { authUser } = useSelector((state) => state.auth);
  const { channelId } = useParams();
  const { messages, pending: chatPending, lastMessageId } = useSelector((state) => state.chat);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [profileOpen, setProfileOpen] = useState(false);

  const messagesWithMedia = messages.filter(message => message.image);

  useSocketChannelMessages({ channelId, authUser });
  const dispatch = useDispatch();

  useEffect(() => {
    if (channelId) {
      dispatch(getChannelMessages(channelId));
    }
  }, [dispatch, channelId])

  //function to send message
  const handleSendToChannel = (messageData) => {
    if (!messageData.text?.trim() && !messageData.image) return;
    dispatch(sendMessageToChannel({ channelId, authUser, messageData }));
    setText('');
    setImage(null);
  }

  const menuRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  const handleMenuClick = ({ userId, e }) => {
    e.stopPropagation();
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const containerRect = messagesContainerRef.current.getBoundingClientRect();

    setMenuPosition({
      top: rect.top - containerRect.top + 20,
      left: rect.left + 150
    });
    setCurrentUserId(currentUserId === userId ? null : userId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setCurrentUserId(null);
      }
    };
    if (currentUserId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentUserId]);

  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  //variable to declare users of current channel
  let currChannelUsers;

  //getting current channel using params
  const currChannel = allChannels.find((item) => item.channelId === channelId);

  //if current channel exists get all of its users
  if (currChannel) currChannelUsers = currChannel.participants;

  //logic for handling ydoc and provider
  const [providerData, setProviderData] = useState({});

  useEffect(() => {
    if (!channelId) return;

    let isActive = true;
    const doc = new Y.Doc();
    let provider;
    const setup = async () => {
      const result = await dispatch(getDocument(channelId)).unwrap().catch(() => null);
      if (result) {
        try {
          const binary = Uint8Array.from(atob(result), c => c.charCodeAt(0));
          Y.applyUpdate(doc, binary);
        } catch (err) {
          console.warn("Error applying Yjs update:", err);
        }
      }
      provider = new WebsocketProvider("ws://localhost:1234", channelId, doc);
      provider.on("sync", () => {
        if (isActive) setProviderData({ doc, provider });
      });
    };
    setup();

    return () => {
      isActive = false;
      setProviderData({ doc: null, provider: null });
      provider?.destroy();
      doc?.destroy();
    };
  }, [channelId, dispatch]);

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div className={`${chatsOpen ? 'hidden' : 'flex'} md:flex w-full flex-1 overflow-hidden relative`}>
        {providerData?.doc && providerData?.provider ? (
          <SimpleEditor doc={providerData.doc} provider={providerData.provider} />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <ImSpinner8 size={25} className='text-zinc-700 dark:text-zinc-500 animate-spin' />
          </div>
        )}
        <div className='h-15 w-full md:max-w-md absolute bottom-10 left-1/2 -translate-x-1/2 p-3 flex items-center justify-center gap-5'>
          <button
            onClick={() => setChannelOpen(true)}
            className='h-full bg-slate-800 text-xs md:text-sm px-2 py-1 rounded-full flex gap-2 items-center border border-zinc-200 dark:border-zinc-800 cursor-pointer'>
            <img className='h-full aspect-square' src="/channelIcon.svg" alt="icon" />
            {currChannel?.channelName || "Channel"}
          </button>
          <button
            onClick={() => setChatsOpen(true)}
            className='h-full bg-slate-800 text-xs md:text-sm px-2 py-1 lg:hidden rounded-full flex gap-2 items-center border border-zinc-200 dark:border-zinc-800 cursor-pointer'>
            <img className='h-5 aspect-square' src="/chat3.svg" alt="icon" />
            Open Chats
          </button>
        </div>
      </div>
      <div className={`${chatsOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full border-l border-zinc-300 dark:border-zinc-800 
      lg:max-w-sm xl:max-w-105 px-5`}>
        <div className='h-13 w-full flex items-center gap-3 py-3 shadow'>
          <button
            onClick={() => setChatsOpen(null)}
            className='mx-1 block lg:hidden text-zinc-600 dark:text-zinc-500 cursor-pointer'>
            <FaArrowLeft size={20} />
          </button>
          <p className='text-md text-zinc-600 dark:text-zinc-400 font-semibold flex items-center '>
            Collab Chats
          </p>
        </div>
        <div ref={messagesContainerRef} className='flex-1 w-full flex flex-col overflow-y-scroll'>
          <ul className='flex-1 w-full flex flex-col items-start justify-end'>
            {messages.map((item) => (
              <button
                key={item._id}
                disabled={item.senderId._id === authUser._id}
                onClick={(e) => {
                  if (item.senderId._id !== authUser._id) {
                    handleMenuClick({ userId: item.senderId, e })
                  }
                }}>
                <Message
                  key={item}
                  item={item}
                  sender={item.senderId}
                  chatPending={chatPending}
                  lastMessageId={lastMessageId}
                />
              </button>
            ))}
          </ul>
        </div>
        {currentUserId && !profileOpen && (
          <>
            <div ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
              className="z-50 w-40 p-3 rounded-xl bg-zinc-300 dark:bg-zinc-800 border border-zinc-300/30 dark:border-zinc-700/30 shadow-lg">
              <button onClick={() => { setCurrentUserId(false) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
                <Link to={`/chat/${currentUserId._id}`} className='flex items-center justify-start gap-3'>
                  <BiSolidMessageAltDetail size={20} className='text-zinc-600 dark:text-zinc-500' />
                  Message
                </Link>
              </button>
              <button onClick={() => { setProfileOpen(true) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
                <span className='flex items-center justify-start gap-3'>
                  <CgProfile size={20} className='text-zinc-600 dark:text-zinc-500' />
                  View profile
                </span>
              </button>
            </div>
          </>
        )}
        <ProfilePopup isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={currentUserId} />
        <div className='w-full flex flex-col p-5 border border-zinc-300 dark:border-zinc-800 rounded-xl my-2'>
          {image && (
            <div className='w-fit relative mb-2'>
              <img
                className='h-35 object-cover rounded-lg'
                src={URL.createObjectURL(image)}
                alt="image"
              />
              <RxCross2
                size={18}
                onClick={() => setImage(null)}
                className='absolute top-2 right-2 cursor-pointer hover:opacity-60 opacity-30'
              />
            </div>
          )}
          <div className='flex items-start'>
            <label htmlFor='fileUpload'>
              {!image && (
                <FaPlus
                  size={25}
                  className='p-1 mx-2 border border-zinc-100 dark:border-zinc-900 hover:border-zinc-400 hover:dark:border-zinc-700 
                  hover:bg-zinc-300/30 hover:dark:bg-zinc-800/50 cursor-pointer rounded-sm text-zinc-400 dark:text-zinc-700'
                />
              )}
            </label>
            <input
              id='fileUpload'
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              accept="image/*"
              className='hidden'
            />
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendToChannel({ text, image });
                }
              }}
              className='w-full focus:outline-none bg-transparent resize-none overflow-hidden min-h-[24px] max-h-[120px]'
              placeholder={`Message to @${currChannel?.channelName || "No name"}`}
              rows={1}
            />
            {(text || image) && (
              <button
                onClick={() => handleSendToChannel({ text, image })}
                className='cursor-pointer'
              >
                <IoSend size={22} className='text-zinc-400 dark:text-zinc-700' />
              </button>
            )}
          </div>
        </div>
      </div>
      <ChannelPopup isOpen={channelOpen} onClose={() => setChannelOpen(false)} channel={currChannel} media={messagesWithMedia} />
    </div>
  )
}

export default StudyRoom