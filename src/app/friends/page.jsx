"use client";
import FriendRequestCard from "@/components/friends/FriendRequestCard";
import { useGetReceivedPendingQuery, useGetSentPendingQuery } from "@/features/friendshipApi";
import { useContext, useEffect } from "react";
import { RootContext } from "../ClientProviders";

export default function FriendsPage() {
  const { data: received = [], isLoading: isLoadingReceived } = useGetReceivedPendingQuery();
  const { data: sent = [], isLoading: isLoadingSent } = useGetSentPendingQuery();
  const { setIsLoading } = useContext(RootContext);

  useEffect(() => {
    setIsLoading(isLoadingReceived || isLoadingSent)
  }, [isLoadingReceived, isLoadingSent])

  return (
    <main className="flex-1 p-6 space-y-8">
      {/* -------------------- Lời mời nhận -------------------- */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Lời mời kết bạn</h1>
          {/* <a href="#" className="text-blue-500 hover:underline">
            Xem tất cả
          </a> */}
        </div>

        {isLoadingReceived ? (
          ""
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {received?.map((item) => (
              <FriendRequestCard key={item.id} friend={item} type={"RECEIVED"} />
            ))}
          </div>
        )}
      </div>

      {/* -------------------- Lời mời đã gửi -------------------- */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Lời mời đã gửi</h1>
          {/* <a href="#" className="text-blue-500 hover:underline">
            Xem tất cả
          </a> */}
        </div>

        {isLoadingSent ? (
          ""
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sent?.map((item) => (
              <FriendRequestCard key={item.id} friend={item} type={"SENT"} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
