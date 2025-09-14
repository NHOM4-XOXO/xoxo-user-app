import { useState } from "react";
import { reactionIcons } from "./ReactionIcon";
import ReactionModal from "./ReactionModal"; // modal hiển thị danh sách reactions

export default function PostFooter({ post, reactionStats }) {
    const { reactionBreakdown, totalReactions } = reactionStats || {};
    const [showModal, setShowModal] = useState(false);
    // Lấy tối đa 3 loại reaction nhiều nhất
    const topReactions = reactionBreakdown
        ? Object.entries(reactionBreakdown)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
        : [];

    return (
        <>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 px-2 py-2 border-b">
                <div className="flex items-center">
                    {/* Icon nổi bật */}
                    {topReactions.map(([type], idx) => {
                        const reaction = reactionIcons.find((r) => r.type === type);
                        return reaction ? (
                            <span key={idx} className={reaction.colorName}>
                                {reaction.icon}
                            </span>
                        ) : null;
                    })}

                    {/* Tổng reactions (click mở modal) */}
                    <span
                        className="text-sm hover:underline ml-1 cursor-pointer"
                        onClick={() => setShowModal(true)}
                    >
                        {totalReactions || 0}
                    </span>
                </div>

                {/* Số bình luận */}
                <span className="text-sm hover:underline cursor-pointer">
                    {`${post?.commentCount || 0} Bình luận`}
                </span>
            </div>

            {/* Modal hiển thị danh sách reactions */}
            {showModal && (
                <ReactionModal
                    postId={post.id}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
