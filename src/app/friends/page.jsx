"use client";
import FriendRequestCard from "../../components/friends/FriendRequestCard";
import { useGetReceivedPendingQuery } from "@/features/friendshipApi";

export default function FriendsPage() {
  const { data: friends = [], isLoading } = useGetReceivedPendingQuery();
  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">
          Lời mời kết bạn
        </h1>
        <a href="#" className="text-blue-500 hover:underline">
          Xem tất cả
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {friends.map((item) => (
          <FriendRequestCard
            key={item.id}
            friend={item}
          />
        ))}
      </div>
    </main>
  );
}
