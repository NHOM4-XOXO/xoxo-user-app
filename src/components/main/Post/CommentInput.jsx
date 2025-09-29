"use client";

import { useState } from "react";
import { Avatar, Input, Tooltip } from "antd";
import { Send } from "lucide-react";
import EmojiButtonPicker from "@/components/common/EmojiButtonPicker";

const { TextArea } = Input;

function CommentInput({
    avatarUrl,
    onSubmit,
    placeholder = "Viết bình luận...",
    autoFocus = false,
}) {
    const [value, setValue] = useState("");

    const handleSend = () => {
        if (!value.trim()) return;
        onSubmit(value.trim());
        setValue(""); // reset sau khi gửi
    };

    return (
        <div className="flex gap-2 items-center justify-center w-full ">
            {/* Avatar bên trái */}
            <Avatar src={avatarUrl} />

            {/* TextArea + icon */}
            <div className="flex-1 relative">
                <TextArea
                    placeholder={placeholder}
                    value={value}
                    autoFocus={autoFocus}
                    onChange={(e) => setValue(e.target.value)}
                    onPressEnter={(e) => {
                        if (!e.shiftKey) {
                            e.preventDefault(); // Enter = gửi
                            handleSend();
                        }
                    }}
                    autoSize={{ minRows: 1, maxRows: 5 }} // tự động giãn dòng
                    className="pr-12" // chừa khoảng trống bên phải
                />

                {/* Emoji + Send button */}

            </div>
            <div className=" flex gap-2 text-gray-500 dark:text-fb-light-quaternary">
                <EmojiButtonPicker
                    onSelect={(emoji) => setValue((prev) => prev + emoji)}
                />
                <Tooltip title="Bình luận" placement="top">
                    <Send
                        className={`w-4 h-4 transition-all duration-150 ${value.trim()
                            ? "cursor-pointer text-blue-500 hover:scale-110"
                            : "cursor-not-allowed text-gray-400"
                            }`}
                        onClick={handleSend}
                    />
                </Tooltip>
            </div>
        </div>
    );
}

export default CommentInput;
