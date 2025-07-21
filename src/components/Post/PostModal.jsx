import { Modal, Input, Avatar } from "antd";
import { useState } from "react";
import {
    ThumbsUp,
    Heart,
    Laugh,
    Smile,
    Camera,
    Image,
    Send,
} from "lucide-react";

function PostModal({ post, comments, isModalOpen, setIsModalOpen }) {
    const [comment, setComment] = useState("");

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
            className="custom-dark-modal dark:bg-fb-dark-primary dark:text-fb-light-primary"
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
                            <p className="font-semibold dark:text-fb-light-primary">{post.name}</p>
                            <p className="text-xs text-gray-500 dark:text-fb-dark-quaternary">{post.time}</p>
                        </div>
                    </div>

                    {/* Caption + ảnh */}
                    <p className="px-2 text-gray-600 dark:text-fb-light-quaternary">{post.caption}</p>
                    <img
                        src={post.image}
                        alt="post"
                        className="w-full rounded-md object-cover"
                    />

                    {/* Like + comment count */}
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-fb-light-quaternary">
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4 text-blue-600" />
                            <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                            <Laugh className="w-4 h-4 text-yellow-400" />
                            <a href="#" className="text-sm hover:underline">
                                {post.likes}
                            </a>
                        </div>
                        <a href="#" className="text-sm hover:underline">
                            {`${post.comments} Bình luận`}
                        </a>
                    </div>

                    <hr className="border-gray-300 dark:border-fb-dark-tertiary" />

                    {/* Comments */}
                    {comments.map((comment) => (
                        <div key={comment.id} className="mb-4">
                            <div className="flex gap-2">
                                <Avatar src={comment.avatar} size={32} />
                                <div>
                                    <div className="bg-fb-light-tertiary dark:bg-fb-dark-secondary px-3 py-2 rounded-xl max-w-[400px] text-gray-900 dark:text-fb-light-primary">
                                        <h3 className="font-semibold mr-2">{comment.name}</h3>
                                        <p>{comment.text}</p>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-fb-light-primary flex gap-3 ml-2 mt-1">
                                        <span>{comment.time}</span>
                                        <span className="cursor-pointer hover:underline">Thích</span>
                                        <span className="cursor-pointer hover:underline">Trả lời</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reply */}
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-2 ml-10 mt-3">
                                    <Avatar size={28} src={reply.avatar} />
                                    <div>
                                        <div className="bg-fb-light-tertiary dark:bg-fb-dark-secondary px-3 py-2 rounded-xl max-w-[350px] text-gray-900 dark:text-fb-light-primary">
                                            <h3 className="font-semibold mr-2">{reply.name}</h3>
                                            <p>{reply.text}</p>
                                        </div>
                                        <div className="text-xs text-gray-500  flex gap-3 ml-2 mt-1 dark:text-fb-light-primary">
                                            <span className="">{reply.time}</span>
                                            <span className="cursor-pointer hover:underline">Thích</span>
                                            <span className="cursor-pointer hover:underline">Trả lời</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
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
                        <Smile className="w-4 h-4 cursor-pointer" />
                        <Camera className="w-4 h-4 cursor-pointer" />
                        <Image className="w-4 h-4 cursor-pointer" />
                        <Send className="w-4 h-4 cursor-pointer" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default PostModal;
