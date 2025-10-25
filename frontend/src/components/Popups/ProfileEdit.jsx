import React, { useEffect, useState } from 'react'
import useClickOutside from '../../customHooks/useClickOutside'
import { RxCross2 } from 'react-icons/rx';
import { motion, AnimatePresence } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { updateProfile, clearError } from "../../reduxToolkit/auth/authSlice"
import { useDispatch, useSelector } from "react-redux"

const ProfileEdit = ({ isOpen, onClose }) => {
    const profileRef = useClickOutside(onClose, isOpen);

    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    const { pending, error: authError} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!fullName.trim()) {
                toast.error("Full name cannot be empty");
                return;
            }
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("bio", bio);
            if (profilePic) formData.append("profilePic", profilePic);

            await dispatch(updateProfile(formData)).unwrap();
            toast.success("Profile updated successfully");
            setFullName("");
            setBio("");
            setProfilePic(null);
            onClose();
        } catch (error) {
            toast.error(error?.message || "Failed to update profile");
        }
    };
    useEffect(() => {
        if(authError) toast.error(authError);
        dispatch(clearError());
    }, [authError, dispatch])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black/30 flex items-center justify-center'
                >
                    <motion.div
                        ref={profileRef}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className='w-full max-w-lg aspect-[3/4] md:aspect-[7/8] rounded-xl bg-zinc-100 dark:bg-zinc-900 p-5 m-5 border border-zinc-300 dark:border-zinc-800 relative'
                    >
                        <button
                            onClick={onClose}
                            className='absolute top-4 right-4 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-600/60 hover:dark:text-zinc-400/60'>
                            <RxCross2 size={20} />
                        </button>
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            className="h-full flex flex-col items-center">
                            <div className='w-full'>
                                <p className='text-sm p-3 text-zinc-400 dark:text-zinc-500'>Profile picture</p>
                                <div className="w-1/4 aspect-square border border-zinc-300 dark:border-zinc-800 rounded-full flex justify-center items-center overflow-hidden">
                                    <label htmlFor="fileUpload" className="cursor-pointer h-full w-full flex justify-center items-center bg-zinc-300/30 dark:bg-zinc-800/30">
                                        {profilePic ? (
                                            <img
                                                src={URL.createObjectURL(profilePic)}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaPlus className="text-neutral-500" />
                                        )}
                                    </label>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setProfilePic(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <div className='w-full'>
                                <p className='text-sm p-3 text-zinc-400 dark:text-zinc-500'>Full Name</p>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    className="w-full rounded-xl bg-zinc-300/30 dark:bg-zinc-800/30 px-4 py-3 border border-zinc-300 dark:border-zinc-800 focus:outline-none"
                                    placeholder="Enter name"
                                />
                            </div>
                            <div className='w-full'>
                                <p className='text-sm p-3 text-zinc-400 dark:text-zinc-500'>Bio</p>
                                <input
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    type="text"
                                    className="w-full rounded-xl bg-zinc-300/30 dark:bg-zinc-800/30 px-4 py-3 border border-zinc-300 dark:border-zinc-800 focus:outline-none"
                                    placeholder="Enter bio"
                                />
                            </div>
                            <div className='flex-1 w-full flex items-end mb-6 sm:mb-10'>
                                <button type="submit" className="w-full p-4 bg-violet-600 hover:bg-indigo-700 cursor-pointer rounded-xl flex justify-center items-center gap-3">
                                    {pending && <CgSpinner size={20} className="animate-spin" />}
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ProfileEdit