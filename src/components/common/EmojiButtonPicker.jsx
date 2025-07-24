import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { Tooltip } from "antd";
import { useTheme } from "next-themes";

function EmojiButtonPicker({ onSelect }) {
    const [open, setOpen] = useState(false);
    const pickerRef = useRef(null);
    const buttonRef = useRef(null);

    const [isDark, setIsDark] = useState(false);
    const { theme, resolvedTheme } = useTheme();
    useEffect(() => {
        // resolvedTheme sẽ là "dark" hoặc "light"
        setIsDark(resolvedTheme === "dark");
    }, [resolvedTheme]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, []);

    return (
        <div className="relative">
            <Tooltip title="Chèn biểu tượng cảm xúc" placement="top">
                <div ref={buttonRef}>
                    <Smile
                        className="w-4 h-4 cursor-pointer hover:scale-110 transition-all duration-150"
                        onClick={(e) => {
                            e.stopPropagation();
                            setTimeout(() => setOpen((prev) => !prev), 0);
                        }}
                    />
                </div>
            </Tooltip>

            {open && (
                <div
                    ref={pickerRef}
                    className="absolute z-50 bottom-full mb-2 right-0 mt-2"
                >
                    <EmojiPicker
                        theme={isDark ? "dark" : ""}
                        emojiStyle="apple"
                        lazyLoadEmojis
                        searchDisabled
                        skinTonesDisabled={false}
                        previewConfig={{ showPreview: false }}
                        suggestedEmojisMode="recent"
                        height={350}
                        width={350}
                        onEmojiClick={(emojiData) => {
                            onSelect(emojiData.emoji);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default EmojiButtonPicker;
