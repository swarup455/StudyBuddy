import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6';
import { useRef, useEffect } from 'react';
import { SimpleEditor } from '.././@/components/tiptap-templates/simple/simple-editor.jsx';
import { IoSend } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { UserCard } from '../components/common/AvatarLogo.jsx';
import Message from '../components/message/Message.jsx';
import Channel from '../components/Popups/Channel.jsx';
import { useSocketChannelMessages } from '../customHooks/useSocketMessage.js';
import { getChannelMessages, sendMessageToChannel } from '../reduxToolkit/chat/chatSlice.js';

const StudyRoom = () => {
  const [text, setText] = useState();
  const [image, setImage] = useState();
  const [channelOpen, setChannelOpen] = useState(false);
  const { allChannels } = useSelector((state) => state.channel);
  const { authUser } = useSelector((state) => state.auth);
  const { channelId } = useParams();
  const { messages, pending: chatPending, lastMessageId } = useSelector((state) => state.chat);
  
  const messagesWithMedia = messages.filter(message => message.image);

  useSocketChannelMessages(channelId);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (channelId) {
      dispatch(getChannelMessages(channelId));
    }
  }, [dispatch, channelId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //function to send message
  const handleSendToChannel = (messageData) => {
    if (!messageData.text?.trim() && !messageData.image) return;
    dispatch(sendMessageToChannel({ channelId, authUser, messageData }));
    setText('');
    setImage(null);
  }

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
  const currChannel = allChannels.find((item) => item.joinId === channelId);

  //if current channel exists get all of its users
  if (currChannel) currChannelUsers = currChannel.participants;

  return (
    <div className="flex flex-row h-screen w-full">
      <div className="h-screen flex flex-col w-1/3 px-5 border-r border-r-zinc-700/30">
        <div
          onClick={() => setChannelOpen(true)}
          className='h-20 text-xl text-zinc-800 dark:text-zinc-500 font-semibold border-b border-zinc-200 
          dark:border-zinc-800 flex items-center justify-start gap-3 cursor-pointer'>
          <img className='h-2/5 aspect-square rounded-full' src="/channel.svg" alt="" />
          <p>{currChannel?.channelName}</p>
        </div>
        <Channel isOpen={channelOpen} onClose={() => setChannelOpen(false)} item={currChannel} media={messagesWithMedia} />
        <ul className='w-full flex flex-1 flex-col-reverse items-start overflow-y-auto'>
          <div ref={messagesEndRef} />
          {[...messages].reverse().map((item) => (
            <Message
              key={item?._id}
              item={item}
              sender={item.senderId}
              chatPending={chatPending}
              lastMessageId={lastMessageId}
            />
          ))}
        </ul>
        <div className='w-full flex flex-col p-3 mb-5 border border-zinc-300 dark:border-zinc-800 rounded-xl'>
          {image &&
            <div className='w-fit relative'>
              <img
                className='h-35 object-cover rounded-lg'
                src={URL.createObjectURL(image)}
                alt="image"
              />
              <RxCross2 size={18} onClick={() => setImage(null)} className='absolute top-2 right-2 cursor-pointer hover:opacity-60 opacity-30' />
            </div>
          }
          <div className='flex items-start my-2'>
            <label htmlFor='fileUpload'>
              {!image &&
                <FaPlus size={25} className='p-1 mx-2 border border-zinc-100 dark:border-zinc-900 hover:border-zinc-400 hover:dark:border-zinc-700 
                hover:bg-zinc-300/30 hover:dark:bg-zinc-800/50 cursor-pointer rounded-sm text-zinc-400 dark:text-zinc-700'/>
              }
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
                  handleSend({ text, image });
                }
              }}
              className='w-full focus:outline-none bg-transparent resize-none overflow-hidden min-h-[24px] max-h-[120px]'
              placeholder={`Message to @${currChannel?.channelName || "undefined"}`}
              rows={1}
            />
            {(text || image) &&
              <button
                onClick={() => handleSendToChannel({ text, image })}
                className='cursor-pointer'>
                <IoSend size={22} className='text-zinc-400 dark:text-zinc-700' />
              </button>
            }
          </div>
        </div>
      </div>
      <div className="h-screen flex-1 flex px-5 overflow-y-auto">
        <SimpleEditor />
      </div>
      <div className="h-screen w-50 px-5 overflow-y-auto">
        {currChannelUsers && currChannelUsers.map((item, index) => (
          <UserCard
            key={item?.user?._id || index}
            user={item?.user}
            work={item?.role}
          />
        ))}
      </div>
    </div>
  )
}

export default StudyRoom