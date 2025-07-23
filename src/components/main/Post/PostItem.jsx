"use client";
import { useRef, useState } from "react";
import PostModal from "./PostModal";

import {
    ThumbsUp,
    Heart,
    MoreHorizontal,
    MessageCircle,
    Share2,
    Users,
    Smile,
} from "lucide-react";
import ReactionPopup from "./ReactionPopup";



const Post = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const toggleCaption = () => setShowFullCaption(!showFullCaption);
    const comment = data.comments;
    const [showPopup, setShowPopup] = useState(false);
    const defaultReaction = {
        icon: <ThumbsUp />,
        name: "Thích",
    }
    const [selectedReaction, setSelectedReaction] = useState(defaultReaction);
    const [isLiked, setIsLiked] = useState(false);


    return (
        <div className="rounded-lg bg-white dark:bg-fb-dark-secondary p-4 space-y-3 shadow-sm border border-gray-200 dark:border-fb-dark-quaternary">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2">
                    <img
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-fb-dark-quaternary"
                        src={data.avatar}
                        alt="Avatar"
                    />
                    <div>
                        <h1 className="font-bold text-sm dark:text-white">{data.name}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {data.time} <Users className="w-3 h-3" />
                        </p>
                    </div>
                </div>
                <MoreHorizontal className="text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary rounded-full p-1 w-6 h-6" />
            </div>

            {/* Caption */}
            <div className="px-2 text-gray-700 dark:text-gray-300 text-sm">
                <p className={showFullCaption ? "" : "line-clamp-2"}>{data.caption}</p>
                {data.caption.length > 100 && (
                    <button
                        onClick={toggleCaption}
                        className="text-blue-500 text-sm mt-1 hover:underline"
                    >
                        {showFullCaption ? "Thu gọn" : "Xem thêm"}
                    </button>
                )}
            </div>

            {/* Image */}
            <img
                className="w-full rounded-md object-cover"
                src={data.image}
                alt="Post"
            />

            {/* Reaction summary */}
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 px-2">
                <div className="flex items-center gap-1">
                    <div className=" flex items-center justify-center">
                        <ThumbsUp size={18} className="text-blue-600" />
                    </div>
                    <div className="flex items-center justify-center">
                        <Heart size={18} className="text-red-600" />
                    </div>
                    <div className=" flex items-center justify-center">
                        <Smile size={18} className="text-yellow-500" />
                    </div>
                    <span className="text-sm hover:underline">{data.likes}</span>
                </div>
                <span className="text-sm hover:underline">
                    {`${data.comments.length} Bình luận`}
                </span>
            </div>

            <hr className="border-gray-200 dark:border-fb-dark-tertiary" />

            {/* Buttons */}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                {/* Button Thích có popup */}
                <div
                    className="w-1/3 relative flex justify-center"
                    onMouseEnter={() => setShowPopup(true)}
                    onMouseLeave={() => setShowPopup(false)}
                >
                    <button className="w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 rounded-md py-2 cursor-pointer" onClick={() => {
                        if (isLiked) {
                            setSelectedReaction(defaultReaction); // bỏ thích
                            setIsLiked(false);
                        } else {
                            setSelectedReaction({
                                ...defaultReaction,
                                icon: <ThumbsUp className="text-blue-600" />
                            }); // thích
                            setIsLiked(true);
                        }
                    }}>
                        {selectedReaction?.icon}
                        {selectedReaction?.name}
                    </button>

                    <div
                        className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition ease-in-out duration-500 
                ${showPopup ? "flex opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                    >
                        <ReactionPopup
                            onSelect={(reaction) => {
                                setSelectedReaction(reaction);
                                setShowPopup(false); // ẩn popup sau khi chọn
                                setIsLiked(true)
                            }}
                        />
                    </div>
                </div>

                {/* Bình luận */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md"
                >
                    <MessageCircle size={18} /> Bình luận
                </button>

                {/* Chia sẻ */}
                <button className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md">
                    <Share2 size={18} /> Chia sẻ
                </button>
            </div>


            {/* Modal */}
            <PostModal
                post={data}
                comments={comment}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div >
    );
};

export default Post;
