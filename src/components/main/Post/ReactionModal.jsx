"use client";

import { useState } from "react";
import { reactionIcons, findReaction } from "./ReactionIcon";
import { useGetPostReactionsQuery } from "@/features/postApi";

export default function ReactionModal({ postId, onClose }) {
    const [activeTab, setActiveTab] = useState("ALL");
    const { data: reactionsPost, isLoading, isFetching } = useGetPostReactionsQuery(postId);

    // Nếu đang loading
    if (isLoading || isFetching) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg w-96 p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Lấy danh sách reactions từ API (tránh undefined)
    const reactions = reactionsPost?.content || [];

    // Thống kê số lượng từng reaction
    const reactionCounts = reactions.reduce((acc, r) => {
        acc[r.reactionType] = (acc[r.reactionType] || 0) + 1;
        return acc;
    }, {});

    // Lọc danh sách theo tab
    const filteredReactions =
        activeTab === "ALL"
            ? reactions
            : reactions.filter((r) => r.reactionType === activeTab);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-96 max-h-[80vh] overflow-hidden flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold">Cảm xúc</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b dark:border-gray-700 overflow-x-auto">
                    {/* Tab Tất cả */}
                    <button
                        onClick={() => setActiveTab("ALL")}
                        className={`px-3 py-2 text-sm ${activeTab === "ALL"
                                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                    >
                        Tất cả ({reactions.length})
                    </button>

                    {/* Các tab khác */}
                    {reactionIcons.map((r) => {
                        const count = reactionCounts[r.type] || 0;
                        if (count === 0) return null;
                        return (
                            <button
                                key={r.type}
                                onClick={() => setActiveTab(r.type)}
                                className={`flex items-center gap-1 px-3 py-2 text-sm ${activeTab === r.type
                                        ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                <span>{r.icon}</span>
                                <span>{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Danh sách người reaction */}
                <div className="flex-1 overflow-y-auto">
                    {filteredReactions.map((rx) => {
                        const reaction = findReaction(rx.reactionType);
                        return (
                            <div
                                key={rx.id}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <img
                                    src={rx.userAvatar || "/default-avatar.png"}
                                    alt={rx.userName}
                                    className="w-9 h-9 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{rx.userName}</p>
                                </div>
                                {reaction && (
                                    <span className={reaction.colorName}>{reaction.icon}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
