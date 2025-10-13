import { useSocketMessages } from '../customHooks/useSocketMessage';
import { useEffect, useState, useRef } from 'react'
import { CiSearch } from "react-icons/ci";
import { getAllUsers, getMessages, sendMessage } from '../reduxToolkit/chat/chatSlice';
import { useSelector, useDispatch } from "react-redux"
import { setOnlineUsers } from '../reduxToolkit/auth/authSlice';
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import Message from '../components/message/Message';

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const { users, chattedUsers, messages, pending: chatPending, lastMessageId } = useSelector((state) => state.chat);
  const { onlineUsers = [], authUser } = useSelector((state) => state.auth);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [text, setText] = useState();
  const [image, setImage] = useState(null);
  useSocketMessages(selectedUser);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(setOnlineUsers());
  }, [dispatch]);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-row h-screen w-full">
      <div className="h-screen w-1/3 border-r border-r-zinc-700/30 px-5 flex flex-col">
        <h1 className='text-2xl text-zinc-800 dark:text-zinc-300 font-semibold my-6'>Messages</h1>
        <div className='w-full p-3 flex items-center gap-3 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30'>
          <CiSearch size={20} className='text-zinc-500 dark:text-zinc-600' />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder='Search or start a new conversation'
            className='w-full focus:outline-none'
          />
          {input &&
            <RxCross2
              size={25}
              className='text-zinc-400 dark:text-zinc-500'
              onClick={() => setInput('')} />
          }
        </div>
        <div className='w-full flex-1 overflow-y-auto'>
          {input ?
            <ul className='h-full w-full'>
              {searchedUsers.map((item) => (
                <li key={item._id} className='h-20 w-full p-5 border-b border-zinc-300 dark:border-zinc-800'>
                  <div
                    onClick={() => setSelectedUser(item)}
                    className='h-full w-full flex items-center justify-start gap-5 cursor-pointer'>
                    <img
                      className='h-full aspect-square rounded-full'
                      src={item?.profilePic || "/demo.png"}
                      alt="sender dp"
                    />
                    <span>
                      <p>{item?.fullName}</p>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            :
            <ul className='h-full w-full'>
              {chattedUsers.map((item) => (
                <li key={item._id} className='h-20 w-full p-5 border-b border-zinc-300 dark:border-zinc-800'>
                  <div
                    onClick={() => setSelectedUser(item)}
                    className='h-full w-full flex items-center justify-start gap-5'>
                    <img
                      className='h-full aspect-square rounded-full'
                      src={item?.profilePic || "/demo.png"}
                      alt="sender dp"
                    />
                    <span>
                      <p>{item?.fullName}</p>
                      {onlineUsers.includes(item?._id) ?
                        <p className="text-green-500 dark:text-green-400">
                          Online
                        </p>
                        :
                        <p className="text-zinc-400 dark:text-zinc-500">
                          Offline
                        </p>
                      }
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
      <div className="h-screen w-2/3 px-5 flex flex-col items-center justify-center">
        {!selectedUser && <img className='h-30' src="/chat.svg" alt='chat' />}
        {selectedUser &&
          <div className='h-full w-full flex flex-col'>
            <div className='h-18 w-full flex items-center gap-5 p-5 border-b border-zinc-300 dark:border-zinc-800'>
              <img className='h-full aspect-square rounded-full' src={selectedUser?.profilePic || "/demo.png"} alt="profile pic" />
              <p className='text-md text-zinc-700 dark:text-zinc-300 font-semibold'>{selectedUser?.fullName}</p>
            </div>
            <ul className='w-full flex flex-1 flex-col-reverse items-start overflow-y-auto'>
              <div ref={messagesEndRef} />
              {[...messages].reverse().map((item) => (
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
            <div className='w-full flex flex-col p-5 mb-5 border border-zinc-300 dark:border-zinc-800 rounded-xl'>
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
                  placeholder={`Message to @${selectedUser?.fullName || "No name"}`}
                  rows={1}
                />
                {(text || image) &&
                  <button
                    onClick={() => handleSend({ text, image })}
                    className='cursor-pointer'>
                    <IoSend size={22} className='text-zinc-400 dark:text-zinc-700' />
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default HomePage