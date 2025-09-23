"use client";

import { RootContext } from "@/app/ClientProviders";
import { useDeleteFriendMutation, useGetFriendsQuery } from "@/features/friendshipApi";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import FriendRequestCard from "@/components/friends/FriendRequestCard";

export default function AllFriendsPage() {
    const { setIsLoading } = useContext(RootContext);
    const { data: friends = [], isLoading, error } = useGetFriendsQuery();
    const [search, setSearch] = useState("");


    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    const filteredFriends = friends.filter(
        (f) =>
            f.displayName?.toLowerCase().includes(search.toLowerCase()) ||
            f.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="flex-1 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Tất cả bạn bè</h1>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {friends.length} người bạn
                </span>
            </div>

            {/* Search box */}
            <div className="relative mb-8 w-full sm:w-1/2">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Tìm kiếm bạn bè..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* List friends */}
            {error ? (
                <p className="text-red-500">Không thể tải danh sách bạn bè.</p>
            ) : isLoading ? (
                <p>Đang tải...</p>
            ) : filteredFriends.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredFriends.map((friend) => (
                        <FriendRequestCard
                            key={friend.id}
                            friend={{ user: friend }}
                            type={"DELETE"}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    Không tìm thấy bạn bè nào.
                </p>
            )}
        </main>
    );
}
