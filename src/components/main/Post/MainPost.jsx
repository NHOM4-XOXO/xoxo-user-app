"use client";

import { useState } from "react";
import ReactionPopup from "./ReactionPopup";
import { Dropdown } from "antd";
import { useTheme } from "next-themes";
import {
    ThumbsUp,
    Heart,
    MoreHorizontal,
    MessageCircle,
    Share2,
    Users,
    Smile,
    Edit,
    Trash2,
} from "lucide-react";
import PostMediaGrid from "./PostMediaGrid";

const menuItems = {
    items: [
        {
            key: "edit",
            icon: <Edit size={16} />,
            label: <p className="text-sm font-semibold">Chỉnh sửa bài viết</p>,
        },
        {
            key: "delete",
            icon: <Trash2 size={16} />,
            label: (
                <p className="text-sm font-semibold text-red-500">Xóa bài viết</p>
            ),
        },
    ],
};

const MainPost = ({ data }) => {
    const [showFullCaption, setShowFullCaption] = useState(false);

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const toggleCaption = () => setShowFullCaption(!showFullCaption);
    const { author, timestamp, content, media, likes, commentsCount, views, comments } = data;


    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2">
                    <img
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-fb-dark-quaternary"
                        src={author.avatar}
                        alt="Avatar"
                    />
                    <div>
                        <h1 className="font-bold text-sm dark:text-white">{author.name}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {timestamp} <Users className="w-3 h-3" />
                        </p>
                    </div>
                </div>
                <Dropdown
                    trigger={["click"]}
                    placement="bottomRight"
                    overlayClassName={isDark ? "custom-dropdown" : ""}
                    menu={menuItems}
                    arrow={{ pointAtCenter: true }}
                >
                    <button type="button">
                        <MoreHorizontal className="text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary rounded-full p-1 w-7 h-7" />
                    </button>
                </Dropdown>
            </div>

            {/* Caption */}
            <div className="px-2 text-gray-700 dark:text-gray-300 text-sm">
                <p className={showFullCaption ? "" : "line-clamp-2"}>{content}</p>
                {content.length > 100 && (
                    <button onClick={toggleCaption} className="text-blue-500 text-sm mt-1 hover:underline">
                        {showFullCaption ? "Thu gọn" : "Xem thêm"}
                    </button>
                )}
            </div>

            {/* Media */}
            {media && media.length > 0 && <PostMediaGrid media={media} postId={data.id} />}

            {/* Reactions */}
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 px-2">
                <div className="flex items-center gap-1">
                    <ThumbsUp size={18} className="text-blue-600" />
                    <Heart size={18} className="text-red-600" />
                    <Smile size={18} className="text-yellow-500" />
                    <span className="text-sm hover:underline">{likes}</span>
                </div>
                <span className="text-sm hover:underline">{`${commentsCount} Bình luận`}</span>
            </div>

        </>
    );
};

export default MainPost;
