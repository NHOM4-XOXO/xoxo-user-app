import { Tooltip } from 'antd';
import React from 'react'

function ReactionPopup({ onSelect }) {
    const reactions = [
        { name: "Thích", icon: "👍", colorName: "text-yellow-500", type: "LIKE" },
        { name: "Yêu thích", icon: "❤️", colorName: "text-red-500", type: "LOVE" },
        { name: "Haha", icon: "😂", colorName: "text-yellow-300", type: "HAHA" },
        { name: "Wow", icon: "😮", colorName: "text-yellow-300", type: "WOW" },
        { name: "Buồn", icon: "😢", colorName: "text-yellow-500", type: "SAD" },
        { name: "Phẫn nộ", icon: "😡", colorName: "text-red-600", type: "ANGRY" },
    ];

    return (
        <div className="bg-white dark:bg-[#3a3b3c] shadow-lg rounded-full px-3 py-3 flex gap-3 items-center border border-gray-200 dark:border-gray-700">
            {reactions.map((reaction, id) => (
                <Tooltip title={reaction.name} key={id}>
                    <div
                        className="hover:scale-125 transition-transform text-2xl duration-150 cursor-pointer"
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
