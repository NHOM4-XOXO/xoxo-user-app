import { Tooltip } from 'antd';
import React from 'react'
import { reactionIcons } from "./ReactionIcon";

function ReactionPopup({ onSelect }) {


    return (
        <div className="bg-white dark:bg-[#3a3b3c] shadow-lg rounded-full px-3 py-3 flex gap-3 items-center border border-gray-200 dark:border-gray-700">
            {reactionIcons.map((reaction, id) => (
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
