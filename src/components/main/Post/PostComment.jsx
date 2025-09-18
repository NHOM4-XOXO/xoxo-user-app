import { Avatar } from "antd";
import { useState } from "react";
import CommentInput from "./CommentInput";

function PostComment({ comment, level = 0, onReply, avatarUrl }) {
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const hasReplies = comment.replies && comment.replies.length > 0;

    const handleSendReply = (content) => {
        onReply(comment.id, content); // gọi callback từ cha
        setIsReplying(false);
    };

    return (
        <div className={`flex gap-3 mb-4 ${level > 0 ? `ml-${Math.min(level * 4, 20)}` : ""}`}>
            <Avatar src={comment.authorAvatarUrl} size={level === 0 ? 32 : 28} />
            <div className="flex-1">
                {/* Nội dung comment */}
                <div className="bg-fb-light-tertiary dark:bg-fb-dark-quaternary px-3 py-2 rounded-xl max-w-[500px] text-sm text-gray-900 dark:text-fb-light-primary">
                    <span className="font-semibold">
                        {comment.authorFirstName} {comment.authorLastName}
                    </span>
                    <p>{comment.content}</p>
                </div>

                {/* Action */}
                <div className="text-xs text-gray-500 dark:text-fb-light-primary flex gap-3 ml-2 mt-1">
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    <span className="cursor-pointer hover:underline">Thích</span>
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        Trả lời
                    </span>
                </div>

                {/* Ô nhập reply */}
                {isReplying && (
                    <div className=" mt-2">
                        <CommentInput
                            avatarUrl={avatarUrl}
                            placeholder="Viết phản hồi..."
                            autoFocus
                            onSubmit={handleSendReply}
                        />
                    </div>
                )}

                {/* Replies */}
                {hasReplies && !showReplies && (
                    <p
                        className="text-sm cursor-pointer text-gray-700 dark:text-fb-light-primary ml-4 mt-1 hover:underline"
                        onClick={() => setShowReplies(true)}
                    >
                        Xem tất cả phản hồi ({comment.replies.length})
                    </p>
                )}

                {showReplies &&
                    hasReplies &&
                    comment.replies.map((reply) => (
                        <PostComment
                            key={reply.id}
                            comment={reply}
                            level={level + 1}
                            onReply={onReply}
                            currentUser={avatarUrl}
                        />
                    ))}
            </div>
        </div>
    );
}

export default PostComment;
