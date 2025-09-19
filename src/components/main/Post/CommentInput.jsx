"use client";

import { useState } from "react";
import { Avatar, Input, Tooltip } from "antd";
import { Send } from "lucide-react";
import EmojiButtonPicker from "@/components/common/EmojiButtonPicker";

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
        <div className="flex gap-2 items-center w-full">
            <Avatar src={avatarUrl} />
            <div className="flex-1 relative">
                <Input
                    placeholder={placeholder}
                    value={value}
                    autoFocus={autoFocus}
                    onChange={(e) => setValue(e.target.value)}
                    onPressEnter={handleSend}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-gray-500 dark:text-fb-light-quaternary">
                    <EmojiButtonPicker onSelect={(emoji) => setValue((prev) => prev + emoji)} />
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
        </div>
    );
}

export default CommentInput;
