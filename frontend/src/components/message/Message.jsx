import React from 'react'
import { CgSpinner } from "react-icons/cg";
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useSelector } from 'react-redux';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(localizedFormat);

//function to format time
const formatMessageTime = (timestamp) => {
    const date = dayjs(timestamp);
    if (date.isToday()) return date.format('h:mm A');
    if (date.isYesterday()) return 'Yesterday';
    if (dayjs().diff(date, 'day') < 7) return date.format('ddd'); // e.g. Mon, Tue
    return date.format('DD/MM/YYYY');
};

const Message = ({
    item,
    sender,
    chatPending,
    lastMessageId
}) => {
    const { authUser } = useSelector((state) => state.auth);
    
    return (
        <div className='max-w-full flex items-start gap-3 px-4 py-1 border border-zinc-300 dark:border-zinc-800 rounded-xl my-3 bg-zinc-300/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 group'>
            {sender?._id === authUser?._id ?
                <img
                    className='h-10 w-10 rounded-full mt-1 flex-shrink-0'
                    src={authUser?.profilePic || "/demo.png"}
                    alt="dp"
                />
                :
                <img
                    className='h-10 w-10 rounded-full mt-1 flex-shrink-0'
                    src={sender?.profilePic || "/demo.png"}
                    alt="dp"
                />
            }
            <div className='flex-1 min-w-0'>
                <div className='flex items-baseline gap-2 mb-1'>
                    <span className='font-semibold text-sm text-zinc-700 dark:text-zinc-400'>
                        {sender?._id === authUser?._id ?
                            <p>You</p>
                            :
                            <p>{sender?.fullName}</p>
                        }
                    </span>
                    <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                        {formatMessageTime(item?.createdAt)}
                    </span>
                </div>
                {item?.text && (
                    <p className='max-w-full text-zinc-800 text-start dark:text-zinc-200 break'>
                        {item?.text}
                    </p>
                )}
                {item?.image && (
                    <div className="relative inline-block my-3">
                        <img
                            className={`max-h-40 max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${sender._id === authUser._id && chatPending && item._id === lastMessageId
                                ? "brightness-50"
                                : "brightness-100"
                                }`}
                            src={item?.image}
                            alt="attachment"
                        />
                        {sender._id === authUser._id && chatPending && item._id === lastMessageId && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <CgSpinner size={25} className="animate-spin opacity-30" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Message