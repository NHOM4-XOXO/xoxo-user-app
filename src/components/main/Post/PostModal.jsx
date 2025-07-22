import { Modal, Input, Avatar, Dropdown, Tooltip } from "antd";
import { DownOutlined } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef } from "react";
import {
    ThumbsUp,
    Heart,
    Laugh,
    Smile,
    Camera,
    Image,
    Send,
} from "lucide-react";
import PostComment from "./PostComment";

const filterOptions = [
    {
        key: "relevant",
        label: (
            <div>
                <p className="font-semibold">Phù hợp nhất</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hiển thị bình luận của bạn bè và những bình luận có nhiều lượt tương
                    tác nhất trước tiên.
                </p>
            </div>
        ),
    },
    {
        key: "newest",
        label: (
            <div>
                <p className="font-semibold">Mới nhất</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hiển thị tất cả bình luận, theo thứ tự là các bình luận mới nhất trước
                    tiên.
                </p>
            </div>
        ),
    },
    {
        key: "all",
        label: (
            <div>
                <p className="font-semibold">Tất cả bình luận</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hiển thị tất cả bình luận, bao gồm cả nội dung có thể là spam.
                </p>
            </div>
        ),
    },
];

function PostModal({ post, comments, isModalOpen, setIsModalOpen }) {
    const [comment, setComment] = useState("");
    const [commentFilter, setCommentFilter] = useState("Phù hợp nhất");

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiRef = useRef(null);

    const handleEmojiClick = (emojiData) => {
        setComment((prev) => prev + emojiData.emoji);
    };

    const handleFilterChange = ({ key }) => {
        const selected = {
            relevant: "Phù hợp nhất",
            newest: "Mới nhất",
            all: "Tất cả bình luận",
        }[key];
        setCommentFilter(selected);
    };

    return (
        <Modal
            title={
                <h2 className="text-xl font-bold text-center mb-3 text-fb-light-primary dark:text-white">
                    Bài viết của {post.name}
                </h2>
            }
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={700}
            centered
            styles={{
                body: {
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "80vh",
                },
            }}
            className="custom-dark-modal"
        >
            {/* Nội dung có thể cuộn */}
            <div className="flex-1 overflow-y-auto  px-5 text-fb-dark-secondary dark:text-fb-light-primary">
                <div className="space-y-3">
                    {/* Header bài viết */}
                    <div className="flex items-center gap-3">
                        <img
                            src={post.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="font-semibold dark:text-fb-light-primary">
                                {post.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                {post.time}
                            </p>
                        </div>
                    </div>

                    {/* Caption + ảnh */}
                    <p className="px-2 text-gray-600 dark:text-fb-light-quaternary">
                        {post.caption}
                    </p>
                    <img
                        src={post.image}
                        alt="post"
                        className="w-full rounded-md object-cover"
                    />

                    {/* Like + comment count */}
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 px-2">
                        <div className="flex items-center gap-1">
                            <div className=" flex items-center justify-center">
                                <ThumbsUp size={18} className="text-blue-600" />
                            </div>
                            <div className="flex items-center justify-center">
                                <Heart size={18} className="text-red-600" />
                            </div>
                            <div className=" flex items-center justify-center">
                                <Smile size={18} className="text-yellow-500" />
                            </div>
                            <span className="text-sm hover:underline">{post.likes}</span>
                        </div>
                        <span className="text-sm hover:underline">
                            {`${post.comments.length} Bình luận`}
                        </span>
                    </div>

                    <hr className="border-gray-300 dark:border-fb-dark-tertiary" />

                    {/* Comments */}
                    <div className="space-y-5">
                        {/* Bộ lọc bình luận */}
                        <Dropdown
                            menu={{
                                items: filterOptions,
                                onClick: handleFilterChange,
                            }}
                            trigger={["click"]}
                            placement="bottomRight"
                            arrow={{ pointAtCenter: true }}
                            overlayStyle={{ maxWidth: 400 }}
                            overlayClassName="custom-dropdown"
                        >
                            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                {commentFilter} <DownOutlined className="ml-1 text-xs" />
                            </button>
                        </Dropdown>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <PostComment key={comment.id} comment={comment} />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Chưa có bình luận nào.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Nhập bình luận */}
            <div className="pt-3 mt-3 flex gap-2 items-center px-2">
                <Avatar src="https://randomuser.me/api/portraits/men/75.jpg" />
                <div className="flex-1 relative">
                    <Input
                        placeholder="Viết bình luận..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-gray-500 dark:text-fb-light-quaternary "
                        ref={emojiRef}
                    >
                        <Dropdown
                            trigger={["click"]}
                            placement="top"
                            arrow
                            overlayClassName="custom-dropdown"
                            overlayStyle={{
                                marginBottom: 16,
                            }}
                            popupRender={() => (
                                <div className="custom-scrollbar ">
                                    <EmojiPicker
                                        theme="dark"
                                        emojiStyle="apple"
                                        lazyLoadEmojis={true}
                                        searchDisabled={true}
                                        skinTonesDisabled={false}
                                        previewConfig={{ showPreview: false }}
                                        suggestedEmojisMode="recent"
                                        height={350}
                                        width={350}
                                        onEmojiClick={handleEmojiClick}
                                    />
                                </div>
                            )}
                        >
                            <Tooltip title="Chọn biểu tượng cảm xúc" placement="top">
                                <Smile className="w-4 h-4 cursor-pointer transition-all duration-150 hover:scale-110" />
                            </Tooltip>
                        </Dropdown>
                        <Tooltip title="Đính kèm một ảnh hoặc video" placement="top">
                            <label className="relative">
                                <Camera className="w-4 h-4 hover:scale-110 transition-all duration-150 z-10 relative cursor-pointer" />
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="absolute inset-0 w-full h-full opacity-0"
                                    title=""
                                />
                            </label>
                        </Tooltip>
                        <Tooltip title="Bình luận" placement="top">
                            <Send className={`w-4 h-4 transition-all duration-150 ${comment.trim()
                                ? "cursor-pointer text-blue-500 hover:scale-110"
                                : "cursor-not-allowed text-gray-400"
                                }`} />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default PostModal;
