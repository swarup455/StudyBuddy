import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCopy, IoShareSocial, IoLogoWhatsapp, IoMail } from "react-icons/io5";
import toast from "react-hot-toast";

const ShareChannel = ({ isOpen, channel, onClose }) => {
    const [copied, setCopied] = useState(false);

    // Reset copied state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setCopied(false);
        }
    }, [isOpen]);

    // Validate channel data
    const channelId = channel?.channelId || "unknown";
    const channelName = channel?.channelName || "Untitled Channel";

    // Generate dynamic shareable link
    const shareLink = `${window.location.origin}/channel/${encodeURIComponent(channelName)}/join/${channelId}`;

    // Copy to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
            console.error("Copy failed:", err);
        }
    };

    // Share on WhatsApp
    const handleShareWhatsapp = () => {
        const text = `Join the "${channelName}" channel (ID: ${channelId}) using this link: ${shareLink}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // Native Web Share API
    const handleShareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Join ${channelName} Channel`,
                    text: `Join the "${channelName}" channel (ID: ${channelId})`,
                    url: shareLink,
                });
                toast.success("Shared successfully!");
            } catch (err) {
                // User cancelled sharing
                if (err.name !== "AbortError") {
                    toast.error("Share failed");
                    console.error("Share failed:", err);
                }
            }
        } else {
            toast.error("Sharing not supported on this device");
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen && onClose) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-zinc-100 dark:bg-zinc-900 
                     border border-zinc-300 dark:border-zinc-800 p-5 rounded-xl shadow-xl 
                     w-[90%] max-w-md z-50"
                    role="dialog"
                    aria-labelledby="share-channel-title"
                    aria-modal="true"
                >
                    <h2
                        id="share-channel-title"
                        className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-100 text-center"
                    >
                        Share Channel
                    </h2>

                    {/* Channel Info */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mb-3">
                        {channelName} <span className="text-xs opacity-70">(ID: {channelId})</span>
                    </p>

                    {/* Shareable Link Box */}
                    <div className="flex items-center gap-2 bg-zinc-200/60 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 mb-4">
                        <input
                            readOnly
                            value={shareLink}
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-700 dark:text-zinc-200 select-all"
                            aria-label="Shareable link"
                            onClick={(e) => e.target.select()}
                        />
                        <button
                            onClick={handleCopy}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
                            aria-label={copied ? "Link copied" : "Copy link"}
                        >
                            <IoCopy size={18} />
                            <span className="text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
                        </button>
                    </div>

                    {/* Share Options */}
                    <div className="flex justify-around">
                        <button
                            onClick={handleShareWhatsapp}
                            className="flex flex-col items-center gap-1 text-green-600 dark:text-green-500 hover:scale-105 transition-transform"
                            aria-label="Share on WhatsApp"
                        >
                            <IoLogoWhatsapp size={28} />
                            <span className="text-xs font-medium">WhatsApp</span>
                        </button>

                        <button
                            onClick={handleShareNative}
                            className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-500 hover:scale-105 transition-transform"
                            aria-label="Share via system share menu"
                        >
                            <IoShareSocial size={28} />
                            <span className="text-xs font-medium">More</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareChannel;