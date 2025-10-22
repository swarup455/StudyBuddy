import React, { useEffect, useState } from 'react'
import { FaToggleOn } from "react-icons/fa6";
import { FaToggleOff } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateChannel } from '../../reduxToolkit/channel/channelSlice';
import { MdDelete } from "react-icons/md";
import DeleteChannel from '../Popups/DeleteChannel';

const Settings = ({ channel }) => {
    const [maxParticipants, setMaxParticipants] = useState(channel?.maxParticipants);
    const [maxEditors, setMaxEditors] = useState(channel?.maxEditors);
    const [allowGuests, setAllowGuests] = useState(channel?.allowGuests);
    const [deleteChannelOpen, setDeleteChannelOpen] = useState(false);
    const { channelId } = useParams()
    const dispatch = useDispatch();
   
    useEffect(() => {
        setMaxParticipants(channel?.maxParticipants);
        setMaxEditors(channel?.maxEditors);
        setAllowGuests(channel?.allowGuests);
    }, [channel]);

    const handleChange = (field, value) => {
        if (field === "maxParticipants") setMaxParticipants(value);
        if (field === "maxEditors") setMaxEditors(value);
        if (field === "allowGuests") setAllowGuests(value);
        dispatch(updateChannel({ channelData: { [field]: value }, channelId }));
    };

    return (
        <div className='flex flex-col gap-5'>
            <div className='p-2 md:p-5 flex items-center gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 
            dark:hover:bg-zinc-950/10 rounded-lg md:rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm'>
                <p className='flex-1'>Allow Guests</p>
                <button onClick={() => handleChange("allowGuests", !allowGuests)} className='flex cursor-pointer'>
                    {allowGuests ?
                        <FaToggleOn size={28} />
                        :
                        <FaToggleOff size={28} />
                    }
                </button>
            </div>
            <div className='p-2 md:p-5 flex items-center gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 
            dark:hover:bg-zinc-950/10 rounded-lg md:rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm'>
                <p className='flex-1'>Maximum participants</p>
                <select
                    value={maxParticipants}
                    className='bg-zinc-300 dark:bg-zinc-800/30 rounded-sm p-1 focus:outline-none border border-zinc-200 dark:border-zinc-800' name="number"
                    onChange={(e) => handleChange("maxParticipants", Number(e.target.value))}>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={5}>5</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={10}>10</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={15}>15</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={20}>20</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={25}>25</option>
                </select>
            </div>
            <div className='p-2 md:p-5 flex items-center gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 
            dark:hover:bg-zinc-950/10 rounded-lg md:rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm'>
                <p className='flex-1'>Maximum editors</p>
                <select
                    value={maxEditors}
                    className='bg-zinc-300 dark:bg-zinc-800/30 rounded-sm p-1 focus:outline-none border border-zinc-200 dark:border-zinc-800' name="number"
                    onChange={(e) => handleChange("maxEditors", Number(e.target.value))}>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={1}>1</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={2}>2</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={3}>3</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={4}>4</option>
                    <option className='bg-zinc-300 dark:bg-zinc-800' value={5}>5</option>
                </select>
            </div>
            <div onClick={() => setDeleteChannelOpen(true)} className='w-full p-3 md:p-6 flex items-center gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 
              dark:hover:bg-zinc-950/10 rounded-lg md:rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm text-red-500 cursor-pointer'>
                <p className='flex-1'>Delete Channel</p>
                <MdDelete size={20} />
            </div>
            <DeleteChannel isOpen={deleteChannelOpen} onClose={() => setDeleteChannelOpen(false)} channelId={channel?.channelId} />
        </div>
    )
}

export default Settings