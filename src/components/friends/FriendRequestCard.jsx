import React from "react";
import Image from "next/image";
import { useAcceptRequestMutation, useRejectRequestMutation } from "@/features/friendshipApi";
import { useGetUserByUsernameQuery } from "@/features/userApi";
import Link from "next/link";
import toast from "react-hot-toast";

const FriendRequestCard = ({ friend, customButton, type = null }) => {
  const [acceptRequest, { isLoading: isAcceptting }] = useAcceptRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();

  const { data: userData, isLoading: isUserLoading } = useGetUserByUsernameQuery(
    friend.user.username,
    { skip: !friend.user.username }
  );

  const handleAccept = async () => {
    if (customButton?.onClick) return customButton.onClick();
    try {
      await acceptRequest(friend.id).unwrap();
      toast.success(
        `Đã chấp nhận lời mời kết bạn từ ${friend.user.displayName || friend.user.username}`
      );
    } catch (err) {
      toast.error(err?.data?.message || "Chấp nhận lời mời kết bạn thất bại");
    }
  };

  const handleReject = async () => {
    if (!customButton) {
      try {
        await rejectRequest(friend.id).unwrap();
      } catch (err) {
        console.error("Reject failed:", err);
      }
    }
  };

  if (isUserLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center text-center animate-pulse">
        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-3"></div>
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center">
      {/* Avatar tròn */}
      <div className="relative w-24 h-24 mb-3">
        <Image
          src={userData?.avatarUrl || "/default-avatar.jpg"}
          alt={userData?.username || "Avatar người dùng"}
          fill
          className="rounded-full object-cover border"
          sizes="96px"
        />
      </div>

      {/* Tên */}
      <h3 className="font-semibold text-lg dark:text-white">
        <Link href={`/profile/${userData?.username}`}>
          {userData?.firstName} {userData?.lastName}
        </Link>
      </h3>

      {/* Bạn chung */}
      {friend?.user?.mutualFriendsCount && (<p className="text-sm text-gray-500 dark:text-gray-400">
        {`${friend?.user?.mutualFriendsCount} bạn chung`}
      </p>)}


      {/* Nút */}
      <div className="mt-4 w-full space-y-2">
        {customButton ? (
          <button
            onClick={handleAccept}
            disabled={isAcceptting || isRejecting}
            className={`${customButton.bgColor} ${customButton.hoverColor} w-full text-white text-sm px-5 py-2 rounded-full transition-colors`}
          >
            {customButton.label}
          </button>
        ) : (
          <>
            {type === "RECEIVED" ? (
              <>
                <button
                  onClick={handleAccept}
                  disabled={isAcceptting || isRejecting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition-colors"
                >
                  Xác nhận
                </button>
                <button
                  onClick={handleReject}
                  disabled={isAcceptting || isRejecting}
                  className="w-full bg-gray-500 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-white text-sm px-5 py-2 rounded-full transition-colors"
                >
                  Xóa
                </button>
              </>
            ) : type === "SENT" ? (
              <button
                className="w-full bg-green-500 text-white text-sm px-5 py-2 rounded-full cursor-not-allowed"
                disabled
              >
                Đã gửi lời mời
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendRequestCard;
