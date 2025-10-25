import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "../../customHooks/useClickOutside";
import { RxCross2 } from "react-icons/rx";

const ProfileCard = ({ isOpen, onClose }) => {
    const { authUser } = useSelector((state) => state.auth);
    const cardRef = useClickOutside(onClose, isOpen);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
                >
                    <motion.div
                        ref={cardRef}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg aspect-[7/8] m-10 rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute cursor-pointer top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
                        >
                            <RxCross2 size={22} />
                        </button>

                        {/* Profile Picture */}
                        <div className="w-full flex items-center justify-center mt-4">
                            <img
                                src={authUser?.profilePic || "/demo.png"}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover ring-4 ring-violet-500/40 shadow-sm"
                            />
                        </div>

                        {/* User Info */}
                        <div className="mt-6 text-center space-y-2">
                            <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                                {authUser?.fullName || "Anonymous User"}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                                {authUser?.bio || "Hey there 👋 I'm using Study Buddy!"}
                            </p>
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent my-6" />

                        {/* Details */}
                        <div className="w-full text-sm space-y-3">
                            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                <span>Email</span>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {authUser?.email || "Not provided"}
                                </span>
                            </div>
                            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                <span>Member Since</span>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {authUser?.createdAt
                                        ? new Date(authUser.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileCard;