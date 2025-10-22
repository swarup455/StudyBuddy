import React, { useState } from 'react'
import useClickOutside from '../../customHooks/useClickOutside';
import { RxCross2 } from 'react-icons/rx';
import Channel from '../ChannelTabs/Channel';
import Media from '../ChannelTabs/Media';
import Members from '../ChannelTabs/Members';
import Settings from '../ChannelTabs/Settings';

const ChannelPopup = ({ isOpen, onClose, channel, media }) => {
    const channelRef = useClickOutside(onClose, isOpen);
    const [activeTab, setActiveTab] = useState("Channel");

    if (!isOpen) return null;
    const settings = ["Channel", "Members", "Media", "Settings"];

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-10'>
            <div ref={channelRef} className='w-full h-2/3 sm:h-3/4 md:h-7/8 max-w-md md:max-w-lg flex flex-col gap-8 p-5 rounded-lg border bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 relative'>
                <div className='w-full'>
                    <ul className='w-full flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 gap-2 md:gap-5 overflow-x-auto whitespace-nowrap'>
                        {settings.map((item) => (
                            <li key={item}>
                                <button
                                    className={`w-full flex items-center justify-start gap-3 p-2 md:gap-5 md:p-5 cursor-pointer border-b-3
                                        ${activeTab === item ? "border-violet-500 text-violet-500" : "border-transparent"}
                                    text-xs sm:text-sm md:text-md`}
                                    onClick={() => setActiveTab(item)}>
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {activeTab === "Channel" && <Channel channel={channel} />}
                {activeTab === "Members" && <Members channel={channel} />}
                {activeTab === "Media" && <Media media={media} />}
                {activeTab === "Settings" && <Settings channel={channel} />}
                <RxCross2
                    onClick={onClose}
                    size={15} className='absolute top-3 right-3 text-zinc-600/60 dark:text-zinc-400/60 hover:text-zinc-600 hover:dark:text-zinc-400 cursor-pointer' />
            </div>
        </div>
    )
}

export default ChannelPopup