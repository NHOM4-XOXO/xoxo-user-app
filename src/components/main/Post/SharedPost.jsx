import { useState } from "react";
import { Dropdown } from "antd";
import { useTheme } from "next-themes";
import { MoreHorizontal, Users, Edit, Trash2, Flag, Lock, Globe } from "lucide-react";
import PostMediaGrid from "./PostMediaGrid";
import PostFooter from "./PostFooter";
import PostCreationModal from "../PostCreation/PostCreationModal";
import ReportModal from "@/components/report/ReportModal";
import { useDeletePostMutation } from "@/features/postApi";
import toast from "react-hot-toast";
import MainPost from "./MainPost";

const SharedPost = ({ data, reactionStats, currentUserId, localCommentCount = null }) => {
    const [showFullCaption, setShowFullCaption] = useState(false);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const [deletePost] = useDeletePostMutation();

    const [showReportModal, setShowReportModal] = useState(false);

    if (!data) return null;

    // Bài viết chia sẻ
    const { post, media = [], sharedPost } = data; // 👈 thêm sharedPost ở backend trả về
    const author = {
        id: post?.authorId,
        name: `${post?.authorFirstName || ""} ${post?.authorLastName || ""}`.trim() || "Người dùng",
        avatar: post?.authorAvatarUrl,
    };

    const toggleCaption = () => setShowFullCaption(!showFullCaption);

    const menuItems = {
        items:
            currentUserId === author.id
                ? [
                    {
                        key: "delete",
                        icon: <Trash2 size={16} />,
                        label: <p className="text-sm font-semibold text-red-500">Xóa bài viết</p>,
                    },
                ]
                : [
                    {
                        key: "report",
                        icon: <Flag size={16} />,
                        label: <p className="text-sm font-semibold text-red-500">Báo cáo bài viết</p>,
                    },
                ],
        onClick: async ({ key }) => {
            if (key === "delete") {
                try {
                    await deletePost(post.id);
                    toast.success("Xóa bài viết thành công.");
                } catch {
                    toast.error("Xóa bài viết thất bại.");
                }
            }
            if (key === "report") {
                setShowReportModal(true);
            }
        },
    };

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2">
                    <img
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-fb-dark-quaternary"
                        src={author.avatar || "/default-avatar.jpg"}
                        alt="Avatar"
                    />
                    <div>
                        <h1 className="font-bold text-sm dark:text-white cursor-pointer hover:underline">
                            {author.name}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {post?.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                            {post?.status === "ACTIVE" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
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
                <p
                    className={`${showFullCaption ? "" : "line-clamp-2"} break-words whitespace-pre-wrap`}
                >
                    {post?.content || ""}
                </p>
                {post?.content && post.content.length > 100 && (
                    <button
                        onClick={toggleCaption}
                        className="text-blue-500 text-sm mt-1 hover:underline"
                    >
                        {showFullCaption ? "Thu gọn" : "Xem thêm"}
                    </button>
                )}
            </div>

            {/* Nếu có media */}
            {media.length > 0 && <PostMediaGrid media={media} postId={post?.id} />}

            {/* Bài viết gốc được chia sẻ */}
            {sharedPost && (
                <div className="border rounded-xl mt-2">
                    <MainPost
                        data={sharedPost}
                        reactionStats={sharedPost.reactionStats}
                        currentUserId={currentUserId}
                    />
                </div>
            )}

            {/* Footer */}
            <PostFooter
                post={{
                    ...post,
                    commentCount: localCommentCount ? localCommentCount : post.commentCount,
                }}
                reactionStats={reactionStats}
            />

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetType="POST"
                targetId={post?.id}
            />
        </>
    );
};

export default SharedPost;
