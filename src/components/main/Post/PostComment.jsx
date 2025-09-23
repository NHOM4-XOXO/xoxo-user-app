import { Avatar } from "antd";
import { useState } from "react";
import CommentInput from "./CommentInput";
import { useGetPostCommentReplieCountAllQuery, useLazyGetPostCommentRepliesQuery } from "@/features/postApi";

function PostComment({ comment, level = 0, onReply, avatarUrl }) {
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const { data: commentReplieCount, isLoading: isLoadingCommentCount } = useGetPostCommentReplieCountAllQuery(comment.id);
    const [getCommentReplies, { data: commentReplies, isLoading, error }] = useLazyGetPostCommentRepliesQuery();

    const hasReplies = commentReplieCount > 0;

    const handleSendReply = (content) => {
        onReply(comment.id, content); // gọi callback từ cha
        setIsReplying(false);
    };

    const handleShowReplies = async (commentId) => {
        setShowReplies(true)
        await getCommentReplies(commentId);
    }

    if (isLoadingCommentCount) {
        return <div className="space-y-3">
            <div className="flex gap-2 animate-pulse">
                {/* Avatar skeleton */}
                <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full"></div>

                {/* Text skeleton */}
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
            </div>
        </div>
    }

    return (
        <div
            className="flex items-start gap-3 mb-4 ml-1 relative"
        >
            {/* Avatar */}
            <Avatar src={comment.authorAvatarUrl} size={28} />
            {/* Nội dung */}
            <div className="flex-1 min-w-0">
                <div className="bg-gray-100 px-3 py-2 w-fit rounded-2xl max-w-full break-words">
                    <span className="font-semibold">{comment.authorFirstName} {comment.authorLastName}</span>
                    <p>{comment.content}</p>
                </div>

                {/* Action */}
                <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-4 ml-2 mt-1">
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    <button
                        className="cursor-pointer hover:underline"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        Trả lời
                    </button>
                </div>

                {/* Reply Input */}
                {isReplying && (
                    <div className="mt-2 ml-2">
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
                        className="text-sm cursor-pointer text-blue-600 ml-2 mt-2 hover:underline"
                        onClick={() => {
                            handleShowReplies(comment.id);
                        }}
                    >
                        Xem tất cả phản hồi ({commentReplieCount})
                    </p>
                )}

                {showReplies &&
                    hasReplies &&
                    commentReplies?.map((reply) => (
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
