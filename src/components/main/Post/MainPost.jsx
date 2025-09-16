import { useState } from "react";
import { Dropdown } from "antd";
import { useTheme } from "next-themes";
import { MoreHorizontal, Users, Edit, Trash2, Flag, EyeOff } from "lucide-react";
import PostMediaGrid from "./PostMediaGrid";
import PostFooter from "./PostFooter";

const MainPost = ({ data, reactionStats, currentUserId }) => {
    const [showFullCaption, setShowFullCaption] = useState(false);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    if (!data) return null;

    const { post, media = [] } = data;

    const author = {
        id: post?.authorId,
        name: `${post?.authorFirstName || ""} ${post?.authorLastName || ""}`.trim() || "Người dùng",
        avatar: post?.authorAvatarUrl,
    };

    const toggleCaption = () => setShowFullCaption(!showFullCaption);

    // Xác định menu dựa vào bài viết của mình hay người khác
    const menuItems = {
        items:
            currentUserId === author.id
                ? [
                    { key: "edit", icon: <Edit size={16} />, label: <p className="text-sm font-semibold">Chỉnh sửa bài viết</p> },
                    { key: "delete", icon: <Trash2 size={16} />, label: <p className="text-sm font-semibold text-red-500">Xóa bài viết</p> },
                ]
                : [
                    { key: "report", icon: <Flag size={16} />, label: <p className="text-sm font-semibold text-red-500">Báo cáo bài viết</p> },
                    { key: "hide", icon: <EyeOff size={16} />, label: <p className="text-sm font-semibold">Ẩn bài viết</p> },
                ],
    };

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
                        <h1 className="font-bold text-sm dark:text-white cursor-pointer hover:underline">{author.name}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {post?.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                            <Users className="w-3 h-3" />
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
                <p className={showFullCaption ? "" : "line-clamp-2"}>{post?.content || ""}</p>
                {post?.content && post.content.length > 100 && (
                    <button onClick={toggleCaption} className="text-blue-500 text-sm mt-1 hover:underline">
                        {showFullCaption ? "Thu gọn" : "Xem thêm"}
                    </button>
                )}
            </div>

            {/* Media */}
            {media.length > 0 && <PostMediaGrid media={media} postId={post?.id} />}

            {/* Reactions */}
            <PostFooter post={post} reactionStats={reactionStats} />
        </>
    );
};

export default MainPost;
