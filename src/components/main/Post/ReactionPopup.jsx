import { Tooltip } from 'antd';
import { Angry, Frown, Heart, Laugh, Smile, ThumbsUp } from 'lucide-react';
import React from 'react'

function ReactionPopup({ onSelect }) {
    const reactions = [
        { name: "Thích", icon: <ThumbsUp className="text-blue-600" /> },
        { name: "Yêu thích", icon: <Heart className="text-red-500" /> },
        { name: "Haha", icon: <Laugh className="text-yellow-400" /> },
        { name: "Wow", icon: <Smile className=" text-yellow-300" /> },
        { name: "Buồn", icon: <Frown className=" text-yellow-500" /> },
        { name: "Phẫn nộ", icon: <Angry className=" text-red-600" /> },
    ];

    return (
        <div className="bg-white dark:bg-[#3a3b3c] shadow-lg rounded-full px-3 py-3 flex gap-3 items-center border border-gray-200 dark:border-gray-700">
            {reactions.map((reaction, id) => (
                <Tooltip title={reaction.name} key={id}>
                    <div
                        className="hover:scale-125 transition-transform duration-150 cursor-pointer"
                        onClick={() => onSelect(reaction)}
                    >
                        {reaction.icon}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
}
export default ReactionPopup;
