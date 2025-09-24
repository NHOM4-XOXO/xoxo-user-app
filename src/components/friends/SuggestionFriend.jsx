"use client";

import { RootContext } from "@/app/ClientProviders";
import FriendCard from "@/components/friends/FriendRequestCard";
import { useGetSuggestionsQuery } from "@/features/friendshipApi";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";

export default function FriendSuggestionsPage() {
    const { setIsLoading } = useContext(RootContext);
    const { data: suggestions = [], isLoading } = useGetSuggestionsQuery();
    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading]);

    return (
        <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold dark:text-white">
                    Gợi ý kết bạn
                </h1>
            </div>

            {isLoading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {suggestions.map((friend) => (
                        <FriendCard
                            key={friend.id}
                            friend={{ user: friend }} // cần match cấu trúc FriendRequestCard
                            type={"SUGGESTION"}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}
