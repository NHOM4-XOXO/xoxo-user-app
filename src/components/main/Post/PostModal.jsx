import { Modal, Input, Avatar, Dropdown, Tooltip } from "antd";
import { DownOutlined } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import {
    ThumbsUp,
    Heart,
    Smile,
    Camera,
    Send,
} from "lucide-react";
import PostComment from "./PostComment";
import { useTheme } from "next-themes";
import EmojiButtonPicker from "@/components/common/EmojiButtonPicker";
import MainPost from "./MainPost";

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
    const [selectedFiles, setSelectedFiles] = useState([]);



    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    const [isDark, setIsDark] = useState(false);
    const { theme, resolvedTheme } = useTheme();
    useEffect(() => {
        // resolvedTheme sẽ là "dark" hoặc "light"
        setIsDark(resolvedTheme === "dark");
    }, [resolvedTheme]);
    const handleEmojiClick = (emoji) => {
        setComment((prev) => prev + emoji);
    };


    const handleFilterChange = ({ key }) => {
        const selected = {
            relevant: "Phù hợp nhất",
            newest: "Mới nhất",
            all: "Tất cả bình luận",
        }[key];
        setCommentFilter(selected);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            const emojiPicker = emojiPickerRef.current;
            const emojiButton = emojiButtonRef.current;

            if (
                emojiPicker &&
                !emojiPicker.contains(e.target) &&
                emojiButton &&
                !emojiButton.contains(e.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside, true); // ⚠️ capture = true
        return () => {
            document.removeEventListener("mousedown", handleClickOutside, true);
        };
    }, []);

    const removeFile = (indexToRemove) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    };






    return (
        <Modal
            title={
                <h2 className="text-xl font-bold text-center mb-3 text-fb-dark-primary dark:text-white">
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
            className={isDark ? "custom-dark-modal" : ""}
        >
            {/* Nội dung có thể cuộn */}
            <div className="flex-1 overflow-y-auto  px-5 text-fb-dark-secondary dark:text-fb-light-primary">
                <div className="space-y-3">
                    <MainPost data={post} />

                    <hr className="border-gray-300 dark:border-fb-dark-tertiary" />

                    {/* Comments */}
                    <div className="space-y-5">
                        {/* Bộ lọc bình luận */}

                        {comments.length > 0 ? (
                            <>
                                <Dropdown
                                    menu={{
                                        items: filterOptions,
                                        onClick: handleFilterChange,
                                    }}
                                    trigger={["click"]}
                                    placement="bottomRight"
                                    arrow={{ pointAtCenter: true }}
                                    overlayStyle={{ maxWidth: 400 }}
                                    overlayClassName={isDark ? "custom-dropdown" : ""}
                                >
                                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                        {commentFilter} <DownOutlined className="ml-1 text-xs" />
                                    </button>
                                </Dropdown>
                                {
                                    comments.map((comment) => (
                                        <PostComment key={comment.id} comment={comment} />
                                    ))
                                }
                            </>

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
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-gray-500 dark:text-fb-light-quaternary">
                        {/* Emoji Button */}
                        <EmojiButtonPicker onSelect={handleEmojiClick} />

                        {/* Upload Image */}
                        <Tooltip title="Đính kèm một ảnh hoặc video" placement="top">
                            <label className="relative">
                                <Camera className="w-4 h-4 hover:scale-110 transition-all duration-150 z-10 relative cursor-pointer" />
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="absolute inset-0 w-full h-full opacity-0"
                                    title=""
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        const newFiles = files.map((file) => ({
                                            url: URL.createObjectURL(file),
                                            type: file.type.startsWith("image") ? "image" : "video",
                                        }));

                                        setSelectedFiles((prev) => [...prev, ...newFiles]);
                                    }}

                                />
                            </label>
                        </Tooltip>

                        {/* Send */}
                        <Tooltip title="Bình luận" placement="top">
                            <Send
                                className={`w-4 h-4 transition-all duration-150 ${comment.trim()
                                    ? "cursor-pointer text-blue-500 hover:scale-110"
                                    : "cursor-not-allowed text-gray-400"
                                    }`}
                            />
                        </Tooltip>
                    </div>

                </div>
            </div>
            {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedFiles.map((fileObj, index) => (
                        <div
                            key={index}
                            className="relative group w-full aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-black/5"
                        >
                            {fileObj.type === "image" ? (
                                <img
                                    src={fileObj.url}
                                    alt={`Selected ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={fileObj.url}
                                    className="w-full h-full object-cover"
                                    controls
                                />
                            )}

                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity opacity-0 group-hover:opacity-100"
                                title="Xóa"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}



        </Modal>
    );
}

export default PostModal;
