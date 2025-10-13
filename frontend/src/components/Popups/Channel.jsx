import React, { useState } from 'react'
import useClickOutside from '../../customHooks/useClickOutside';
import { UserLogo } from '../common/AvatarLogo';
import { RxCross2 } from 'react-icons/rx';

const Channel = ({ isOpen, onClose, item, media }) => {
    const channelRef = useClickOutside(onClose, isOpen);
    const [activeTab, setActiveTab] = useState("members");
    const members = item?.participants;

    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div ref={channelRef} className='w-full h-1/2 sm:h-3/4 lg:h-5/6 max-w-xl flex flex-col gap-5 rounded-xl p-8 border bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 relative'>
                <div className='flex flex-col items-center justify-center text-center'>
                    <img
                        className='w-30 aspect-square rounded-full ring-4 ring-offset-3 ring-violet-500 ring-offset-zinc-100 dark:ring-offset-zinc-900'
                        src="/channel.svg" alt="channel"
                    />
                    <p className='text-2xl font-semibold text-zinc-700 dark:text-zinc-300 my-2'>{item?.channelName}</p>
                    <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis excepturi deserunt harum nobis quod perferendis alias
                    </p>
                </div>
                <div className='w-full flex items-center justify-center border-b border-zinc-300 dark:border-zinc-800 gap-20'>
                    <span
                        onClick={() => setActiveTab("members")}
                        className={`p-1 border-b-3 ${activeTab === "members" ? "border-violet-500" : "border-transparent"} cursor-pointer`}>
                        Members
                    </span>
                    <span
                        onClick={() => setActiveTab("media")}
                        className={`p-1 border-b-3 ${activeTab === "media" ? "border-violet-500" : "border-transparent"} cursor-pointer`}>
                        Media
                    </span>
                </div>
                {activeTab === "members" &&
                    <ul className='flex-1 overflow-y-auto'>
                        {members.map((member) => (
                            <li key={member?.user?._id}>
                                <UserLogo name={member?.user?.fullName} about={member?.user?.about} isOnline={false} />
                            </li>
                        ))}
                    </ul>
                }
                {activeTab === "media" &&
                    <ul className='flex-1 overflow-y-auto grid gap-4 grid-cols-4'>
                        {media.map((media) => (
                            <li key={media?._id}>
                                <img src={media?.image} className='w-full rounded-sm aspect-square object-cover' alt="media" />
                            </li>
                        ))}
                    </ul>
                }
                <RxCross2
                    onClick={onClose}
                    size={20} className='absolute top-5 right-5 text-zinc-600/60 dark:text-zinc-400/60
                 hover:text-zinc-600 hover:dark:text-zinc-400 cursor-pointer' />
            </div>
        </div>
    )
}

export default Channel
