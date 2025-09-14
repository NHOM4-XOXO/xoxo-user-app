export const reactionIcons = [
    { name: "Thích", icon: "👍", colorName: "text-yellow-500", type: "LIKE" },
    { name: "Yêu thích", icon: "❤️", colorName: "text-red-500", type: "LOVE" },
    { name: "Haha", icon: "😂", colorName: "text-yellow-300", type: "HAHA" },
    { name: "Wow", icon: "😮", colorName: "text-yellow-300", type: "WOW" },
    { name: "Buồn", icon: "😢", colorName: "text-yellow-500", type: "SAD" },
    { name: "Phẫn nộ", icon: "😡", colorName: "text-red-600", type: "ANGRY" },
];
export const findReaction = (type) => {
    return reactionIcons.find((r) => r.type === type);
};