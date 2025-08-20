"use client";

import { useState } from "react";
import PostModal from "./PostModal";
import MainPost from "./MainPost";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import ReactionPopup from "./ReactionPopup";



const Post = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id, comments } = data;
    const [showPopup, setShowPopup] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState({
        icon: <ThumbsUp />, name: "Thích",
    });
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="rounded-lg bg-white dark:bg-fb-dark-secondary p-4 space-y-3 shadow-sm ">
            <MainPost key={id} data={data} />

            {/* Actions */}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <div
                    className="w-1/3 relative flex justify-center"
                    onMouseEnter={() => setShowPopup(true)}
                    onMouseLeave={() => setShowPopup(false)}
                >
                    <button
                        className="w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 rounded-md py-2 cursor-pointer"
                        onClick={() => {
                            if (isLiked) {
                                setSelectedReaction({ icon: <ThumbsUp />, name: "Thích" });
                                setIsLiked(false);
                            } else {
                                setSelectedReaction({ icon: <ThumbsUp className="text-blue-600" />, name: "Thích" });
                                setIsLiked(true);
                            }
                        }}
                    >
                        {selectedReaction.icon}
                        {selectedReaction.name}
                    </button>
                    <div
                        className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition ease-in-out duration-500 ${showPopup ? "flex opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                            }`}
                    >
                        <ReactionPopup
                            onSelect={(reaction) => {
                                setSelectedReaction(reaction);
                                setShowPopup(false);
                                setIsLiked(true);
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer"
                >
                    <MessageCircle size={18} /> Bình luận
                </button>

                <button className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer">
                    <Share2 size={18} /> Chia sẻ
                </button>
            </div>

            <PostModal
                post={data}
                comments={comments}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    );
};

export default Post;
