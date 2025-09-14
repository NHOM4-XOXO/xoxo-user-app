"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import MainPost from "./MainPost";
import { useSharePostMutation } from "@/features/postApi";
import { useGetMyProfileQuery } from "@/features/userApi";

const ShareModal = ({ isOpen, onClose, post }) => {
    const [content, setContent] = useState("");
    const [sharePost] = useSharePostMutation();
    const { data: profile } = useGetMyProfileQuery();

    const handleOk = async () => {
        if (!content.trim()) return;

        const toastId = toast.loading("Đang chia sẻ...");

        try {
            await sharePost({ postId: post?.post?.id, content }).unwrap();
            toast.success("Chia sẻ thành công!", { id: toastId });
            onClose();
            setContent("");
        } catch (err) {
            console.error("Share failed:", err);
            toast.error("Chia sẻ thất bại!", { id: toastId });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-lg p-5 relative transform transition-transform duration-300 ease-out">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={profile?.avatarUrl}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {profile?.firstName} {profile?.lastName}
                        </p>
                        <span className="text-xs text-gray-500">Chia sẻ công khai</span>
                    </div>
                </div>

                {/* Input */}
                <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Bạn đang nghĩ gì về bài viết này?"
                    className="w-full resize-none p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                />

                {/* Preview bài viết */}
                {post && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                        <MainPost post={post?.post} isPreview />
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleOk}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Chia sẻ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
