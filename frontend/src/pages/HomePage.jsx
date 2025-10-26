import { useSocketMessages } from '../customHooks/useSocketMessage';
import { useEffect, useState, useRef } from 'react'
import { CiSearch } from "react-icons/ci";
import { getAllUsers, getMessages, sendMessage } from '../reduxToolkit/chat/chatSlice';
import { useSelector, useDispatch } from "react-redux"
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import Message from '../components/message/Message';
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProfilePopup from '../components/Popups/ProfilePopup';

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const { users, chattedUsers, messages, pending: chatPending, lastMessageId } = useSelector((state) => state.chat);
  const { onlineUsers, authUser } = useSelector((state) => state.auth);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [text, setText] = useState();
  const [image, setImage] = useState(null);
  const { userId } = useParams();
  const [profileOpen, setProfileOpen] = useState(false);

  useSocketMessages(selectedUser);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!userId) return;

    const currentUser = users.find((item) => item._id === userId);
    if (currentUser) {
      setSelectedUser(currentUser);
    } else if (users.length > 0) {
      toast.error("Can't find User!!");
    }
  }, [userId, users]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
    }
  }, [dispatch, selectedUser])

  useEffect(() => {
    if (input === "") {
      setSearchedUsers([]);
    } else if (input) {
      const filtered = users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      );
      setSearchedUsers(filtered);
    }
  }, [input, users]);

  const textareaRef = useRef(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  //function to send message data
  const handleSend = (messageData) => {
    if (!messageData.text?.trim() && !messageData.image) return;

    dispatch(sendMessage({ userId: selectedUser._id, authUser, messageData }));
    setText('');
    setImage(null);
  }
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = messagesEndRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);
  
  return (
    <div className="flex flex-row w-full h-full overflow-hidden">
      <div className={`flex flex-col w-full md:max-w-xs lg:max-w-sm ${selectedUser ? 'hidden' : 'block'} md:block border-r border-r-zinc-700/30 px-5`}>
        <div className='w-full p-3 flex items-center gap-3 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30 my-5'>
          <CiSearch size={20} className='text-zinc-500 dark:text-zinc-600' />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder='Search or start a new conversation'
            className='w-full focus:outline-none'
          />
          {input && (
            <RxCross2
              size={25}
              className='text-zinc-400 dark:text-zinc-500 cursor-pointer'
              onClick={() => setInput('')}
            />
          )}
        </div>
        <div className='flex-1 w-full overflow-y-auto mt-2 border-t border-zinc-300 dark:border-zinc-800 py-3'>
          <h1 className='text-sm text-zinc-400 dark:text-zinc-500 my-2'>Direct messages</h1>
          <ul className='w-full'>
            {(input ? searchedUsers : chattedUsers).map((item) => (
              <li key={item._id} className='h-18 w-full py-3'>
                <Link
                  to={`/chat/${item._id}`}
                  className='h-full w-full flex items-center justify-start gap-5 cursor-pointer'
                >
                  <div className="relative w-fit h-full">
                    <img
                      className='h-full aspect-square rounded-full'
                      src={item?.profilePic || "/demo.png"}
                      alt="sender dp"
                    />
                    {onlineUsers.includes(item?._id) ?
                      <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                      :
                      <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-zinc-400 border-2 border-white dark:border-zinc-900 rounded-full" />
                    }
                  </div>
                  <p>{item?.fullName}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`${selectedUser ? 'flex' : 'hidden'} md:flex flex-col flex-1 px-5`}>
        {!selectedUser && (
          <div className='h-full w-full flex items-center justify-center'>
            <img className='w-1/2' src="/chat.svg" alt='chat' />
          </div>
        )}
        {selectedUser && (
          <>
            <div className='h-13 w-full flex items-center gap-3 p-2 border-b border-zinc-300 dark:border-zinc-800'>
              <Link
                to="/"
                className='mx-1 text-zinc-600 dark:text-zinc-400 cursor-pointer'>
                <FaArrowLeft />
              </Link>
              <button
                onClick={() => setProfileOpen(true)}
                className='h-full flex items-center gap-5 px-3 py-1 hover:bg-zinc-300/50 dark:hover:bg-zinc-800/50 rounded-md cursor-pointer'>
                <img
                  className='h-full aspect-square rounded-full'
                  src={selectedUser?.profilePic || "/demo.png"}
                  alt="profile pic"
                />
                <p className='text-md text-zinc-700 dark:text-zinc-300 font-semibold'>
                  {selectedUser?.fullName}
                </p>
              </button>
            </div>
            <ProfilePopup isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={selectedUser} />
            <div ref={messagesEndRef} className='flex-1 w-full flex flex-col overflow-y-scroll'>
              <ul className='flex-1 w-full flex flex-col items-start justify-end'>
                {[...messages].map((item) => (
                  <Message
                    key={item?._id}
                    item={item}
                    sender={item.senderId}
                    receiver={item.receiverId}
                    chatPending={chatPending}
                    lastMessageId={lastMessageId}
                  />
                ))}
              </ul>
            </div>
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
                      handleSend({ text, image });
                    }
                  }}
                  className='w-full focus:outline-none bg-transparent resize-none overflow-hidden min-h-[24px] max-h-[120px]'
                  placeholder={`Message to @${selectedUser?.fullName || "No name"}`}
                  rows={1}
                />
                {(text || image) && (
                  <button
                    onClick={() => handleSend({ text, image })}
                    className='cursor-pointer'
                  >
                    <IoSend size={22} className='text-zinc-400 dark:text-zinc-700' />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>

  )
}

export default HomePage