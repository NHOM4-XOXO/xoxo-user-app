"use client";

import { Modal, Input, Avatar, Dropdown, Tooltip } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { Camera, Send } from "lucide-react";
import PostComment from "./PostComment";
import { useTheme } from "next-themes";
import EmojiButtonPicker from "@/components/common/EmojiButtonPicker";
import MainPost from "./MainPost";
import { useCommentPostMutation, useGetPostCommentsQuery } from "@/features/postApi";
import { useSelector } from "react-redux";
import CommentInput from "./CommentInput";


const filterOptions = [
    { key: "relevant", label: <div><p className="font-semibold">Phù hợp nhất</p><p className="text-xs text-gray-500 dark:text-gray-400">Hiển thị bình luận của bạn bè và những bình luận có nhiều lượt tương tác nhất trước tiên.</p></div> },
    { key: "newest", label: <div><p className="font-semibold">Mới nhất</p><p className="text-xs text-gray-500 dark:text-gray-400">Hiển thị tất cả bình luận, theo thứ tự là các bình luận mới nhất trước tiên.</p></div> },
    { key: "all", label: <div><p className="font-semibold">Tất cả bình luận</p><p className="text-xs text-gray-500 dark:text-gray-400">Hiển thị tất cả bình luận, bao gồm cả nội dung có thể là spam.</p></div> },
];

function PostModal({ post, isModalOpen, setIsModalOpen, reactionStats }) {
    const [comment, setComment] = useState("");
    const [commentPost] = useCommentPostMutation();
    const [localCommentCount, setLocalCommentCount] = useState(post?.post?.commentCount || 0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);
    const id = post?.post?.id;
    let profile;
    try {
        profile = JSON.parse(localStorage.getItem("profile"));
    } catch (e) {
        console.error("Không đọc được localStorage:", e);
    }
    const avatarUrl = profile?.avatarUrl

    const { data: comments, isLoading, isFetching } = useGetPostCommentsQuery(id, {
        skip: !id
    });


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target) &&
                emojiButtonRef.current && !emojiButtonRef.current.contains(e.target)) {
                setSelectedFiles(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, []);

    const removeFile = (indexToRemove) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    const authorName = `${post?.authorFirstName || ""} ${post?.authorLastName || ""}`.trim() || "Người dùng";

    const handleSendComment = async (content, parentCommentId = null) => {
        if (!content.trim()) return;
        setLocalCommentCount((prev) => prev + 1);

        try {
            await commentPost({
                postId: id,
                content: content.trim(),
                parentCommentId,
            }).unwrap();

            if (!parentCommentId) {
                setComment(""); // clear input cho comment gốc
            }
        } catch (error) {
            console.error("Gửi comment thất bại:", error);
            // Rollback nếu là comment gốc
            if (!parentCommentId) {
                setLocalCommentCount((prev) => Math.max(prev - 1, 0));
            }
        }
    };


    return (
        <Modal
            title={<h2 className="text-xl font-bold text-center mb-3 text-fb-dark-primary dark:text-white">Bài viết của {authorName}</h2>}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={700}
            centered
            styles={{
                body: {
                    maxHeight: "70vh",
                    overflowY: "auto",
                    paddingBottom: "80px", // chừa khoảng cho input
                },
            }}

        >
            {/* Post chính */}
            <MainPost data={post} reactionStats={reactionStats} localCommentCount={localCommentCount} />


            {/* Bình luận */}
            {isLoading ? (
                null
            ) : comments && comments.length > 0 ? (
                <div className=" pt-2">
                    {/* Danh sách bình luận */}
                    {comments.map((c) => (
                        <PostComment
                            key={c.id}
                            comment={c}
                            onReply={(parentCommentId, content) =>
                                handleSendComment(content, parentCommentId)
                            }
                            avatarUrl={avatarUrl}
                        />
                    ))}

                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Chưa có bình luận nào.
                </p>
            )}


            {/* Nhập bình luận */}
            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-fb-dark-secondary p-3 border-t border-gray-200 dark:border-gray-600">
                <CommentInput
                    avatarUrl={avatarUrl}
                    onSubmit={(content) => handleSendComment(content, null)}
                />
            </div>

            {/* Xem file upload */}
            {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedFiles.map((fileObj, index) => (
                        <div key={index} className="relative group w-full aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-black/5">
                            {fileObj.type === "image" ? (
                                <img src={fileObj.url} alt={`Selected ${index}`} className="w-full h-full object-cover" />
                            ) : (
                                <video src={fileObj.url} className="w-full h-full object-cover" controls />
                            )}
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity opacity-0 group-hover:opacity-100"
                                title="Xóa"
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}

export default PostModal;
