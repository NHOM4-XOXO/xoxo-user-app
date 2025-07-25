import { Avatar } from "antd";
import { useState } from "react";

// Component đệ quy hiển thị comment hoặc reply
function PostComment({ comment, level = 0 }) {
    const [showReplies, setShowReplies] = useState(false);

    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <div className={`flex gap-3 mb-4 ${level > 0 ? `ml-${Math.min(level * 4, 20)}` : ""}`}>
            {/* Avatar người bình luận */}
            <Avatar src={comment.author.avatar} size={level === 0 ? 32 : 28} />
            <div className="flex-1">
                {/* Nội dung bình luận */}
                <div className="bg-fb-light-tertiary dark:bg-fb-dark-quaternary px-3 py-2 rounded-xl max-w-[500px] text-sm text-gray-900 dark:text-fb-light-primary">
                    <span className="font-semibold">{comment.author.name}</span>
                    <p>{comment.content}</p>
                </div>

                {/* Hành động phụ */}
                <div className="text-xs text-gray-500 dark:text-fb-light-primary flex gap-3 ml-2 mt-1">
                    <span>{comment.timestamp}</span>
                    <span className="cursor-pointer hover:underline">Thích</span>
                    <span className="cursor-pointer hover:underline">Trả lời</span>
                </div>

                {/* Nút xem phản hồi */}
                {!showReplies && hasReplies && (
                    <p
                        className="text-sm cursor-pointer text-gray-700 dark:text-fb-light-primary ml-4 mt-1 hover:underline"
                        onClick={() => setShowReplies(true)}
                    >
                        Xem tất cả phản hồi ({comment.replies.length})
                    </p>
                )}

                {/* Đệ quy hiển thị phản hồi */}
                {showReplies &&
                    comment.replies.map((reply) => (
                        <PostComment key={reply.id} comment={reply} level={level + 1} />
                    ))}
            </div>
        </div>
    );
}

export default PostComment;
