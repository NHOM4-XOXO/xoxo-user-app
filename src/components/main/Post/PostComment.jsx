import { Avatar } from 'antd';
import { useState } from 'react'

function PostComment({ comment }) {
    const [showReplies, setShowReplies] = useState(false);
    return (
        <div key={comment.id} className="flex gap-3">
            <Avatar src={comment.avatar} size={32} />
            <div>
                <div className="bg-fb-light-tertiary dark:bg-fb-dark-secondary px-3 py-2 rounded-xl max-w-[400px] text-sm text-gray-900 dark:text-fb-light-primary">
                    <span className="font-semibold">{comment.name}</span>
                    <p>{comment.text}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-fb-light-primary flex gap-3 ml-2 mt-1">
                    <span>{comment.time}</span>
                    <span className="cursor-pointer hover:underline">
                        Thích
                    </span>
                    <span className="cursor-pointer hover:underline">
                        Trả lời
                    </span>
                </div>
                {!showReplies && comment?.replies.length > 0 && (
                    <p
                        className="text-sm cursor-pointer text-gray-300 dark:text-fb-light-primary flex gap-3 ml-2 mt-1"
                        onClick={() => setShowReplies(true)}
                    >
                        Xem tất cả phản hồi
                    </p>
                )}
                {/* Trả lời bình luận */}
                {showReplies &&
                    comment.replies?.map((reply) => (
                        <div key={reply.id} className="flex gap-2 mt-3 ml-8">
                            <Avatar size={28} src={reply.avatar} />
                            <div>
                                <div className="bg-fb-light-tertiary dark:bg-fb-dark-secondary px-3 py-2 rounded-xl max-w-[350px] text-sm text-gray-900 dark:text-fb-light-primary">
                                    <span className="font-semibold">
                                        {reply.name}
                                    </span>
                                    <p>{reply.text}</p>
                                </div>
                                <div className="text-xs text-gray-500 flex gap-3 ml-2 mt-1 dark:text-fb-light-primary">
                                    <span>{reply.time}</span>
                                    <span className="cursor-pointer hover:underline">
                                        Thích
                                    </span>
                                    <span className="cursor-pointer hover:underline">
                                        Trả lời
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default PostComment