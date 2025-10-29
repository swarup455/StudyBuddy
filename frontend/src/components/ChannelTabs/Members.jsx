import React, { useState, useRef, useEffect } from 'react'
import { UserLogo } from '../common/AvatarLogo';
import { CiSearch } from 'react-icons/ci';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { FaPenToSquare } from "react-icons/fa6";
import { MdViewAgenda } from "react-icons/md";
import { kickOutUser, updateRole, clearError } from '../../reduxToolkit/channel/channelSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast"

const Members = ({ channel }) => {
    const members = channel.participants;
    const [input, setInput] = useState('');
    const [searchedMembers, setSearchedMembers] = useState();
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [currMember, setCurrentMember] = useState(null);
    const { error } = useSelector((state) => state.channel);
    const dispatch = useDispatch();
    const { channelId } = useParams();

    const menuRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (input === "") {
            setSearchedMembers([]);
        } else if (input) {
            const filteredMembers = members.filter((m) =>
                m.user?.fullName?.toLowerCase().includes(input.toLowerCase())
            );
            setSearchedMembers(filteredMembers);
        }
    }, [input, members]);

    const handleMenuClick = (memberId, e) => {
        e.stopPropagation();
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        setMenuPosition({
            top: rect.bottom - containerRect.top - 100,
            left: rect.left - containerRect.left - 140
        });
        setCurrentMember(currMember === memberId ? null : memberId);
    };

    const handleKickoutUser = ({ member }) => {
        const userData = {};
        if (member && member.isGuest) {
            userData.guestTempId = member.guestTempId;
        } else {
            userData.userId = member.user._id;
        }
        dispatch(kickOutUser({ userData, channelId }));
    }
    const handleChangeRole = ({ member, role }) => {
        if (member && !member.isGuest) {
            dispatch(updateRole({ channelId, userId: member.user._id, role }))
        } else if (member && member.isGuest) {
            toast.dismiss("Guest can't become editor!!")
        }
    }
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setCurrentMember(null);
            }
        };
        if (currMember) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [() => setCurrentMember(null), currMember]);

    return (
        <div ref={containerRef} className='relative w-full flex-1 space-y-5 overflow-y-scroll'>
            <div className='w-full p-3 flex items-center gap-3 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-400/30 dark:hover:bg-zinc-800/30'>
                <CiSearch size={20} className='text-zinc-500 dark:text-zinc-600' />
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder='Search Members'
                    className='w-full focus:outline-none'
                />
                {input &&
                    <RxCross2
                        size={25}
                        className='text-zinc-400 dark:text-zinc-500'
                        onClick={() => setInput('')} />
                }
            </div>
            <ul className='flex-1 space-y-3'>
                {(input ? searchedMembers : members).map((member) => (
                    <li className='relative p-3 md:p-5 h-15 md:h-18 flex items-center gap-2 md:gap-5 group bg-zinc-300/30 dark:bg-zinc-950/30 hover:bg-zinc-300/10 dark:hover:bg-zinc-950/10 
                    rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm' key={member?.user?._id}>
                        <UserLogo name={member?.user?.fullName} about={member?.user?.about}
                            role={member.role} isAdmin={channel.channelAdmin._id === member.user._id}
                            isOnline={false} />
                        <button
                            className='hover:bg-zinc-300/30 dark:hover:bg-zinc-800/30 p-1 rounded-md border border-transparent hover:border-zinc-200 
                            hover:dark:border-zinc-800 text-transparent group-hover:text-zinc-600 dark:group-hover:text-zinc-400 cursor-pointer'
                            onClick={(e) => handleMenuClick(member, e)}>
                            <BsThreeDotsVertical className='text-sm lg:text-lg' />
                        </button>
                    </li>
                ))}
            </ul>
            {currMember && (
                <div ref={menuRef}
                    style={{ position: 'absolute', top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                    className="z-50 w-40 p-3 rounded-xl bg-zinc-300 dark:bg-zinc-800 border border-zinc-300/30 dark:border-zinc-700/30 shadow-lg">
                    <button onClick={() => { setCurrentMember(false), handleChangeRole({ member: currMember, role: currMember.role === "Editor" ? "Viewer" : "Editor" }) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
                        <span className='flex items-center justify-start gap-3'>
                            {currMember.role === "Viewer" ?
                                <>
                                    <FaPenToSquare className='text-zinc-600 dark:text-zinc-400' />
                                    Make Editor
                                </>
                                :
                                <>
                                    <MdViewAgenda className='text-zinc-600 dark:text-zinc-400' />
                                    Remove Editor
                                </>
                            }
                        </span>
                    </button>
                    <button onClick={() => { setCurrentMember(false), handleKickoutUser({ member: currMember }) }} className="w-full text-left p-2 text-sm hover:bg-zinc-300/30 dark:hover:bg-zinc-700/30 rounded-lg cursor-pointer">
                        <span className='flex items-center justify-start gap-3'>
                            <IoPersonRemoveSharp className='text-zinc-600 dark:text-zinc-400' />
                            Kickout User
                        </span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Members
