import React from "react";
import Image from "next/image";
import { useAcceptRequestMutation, useRejectRequestMutation } from "@/features/friendshipApi";
import { useGetUserByUsernameQuery } from "@/features/userApi";
import Link from "next/link";
import toast from "react-hot-toast";

const FriendRequestCard = ({ friend, customButton, type = null }) => {
  const [acceptRequest, { isLoading: isAcceptting }] = useAcceptRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();

  const { data: userData, isLoading: isUserLoading } = useGetUserByUsernameQuery(friend.user.username, { skip: !friend.user.username });

  const handleAccept = async () => {
    if (customButton?.onClick) return customButton.onClick();
    try {
      await acceptRequest(friend.id).unwrap();
      toast.success(`Đã chấp nhận lời mời kết bạn từ ${friend.user.displayName || friend.user.username}`);
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

  // Nếu userData đang load, hiển thị skeleton
  if (isUserLoading) {
    return (
      <div className="rounded-lg overflow-hidden dark:bg-[#242526] shadow-md border border-gray-300 dark:border-gray-700 animate-pulse">
        <div className="w-full h-40 bg-gray-300 dark:bg-gray-700"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden dark:bg-[#242526] shadow-md border border-gray-300 dark:border-gray-700 cursor-pointer">
      {/* Avatar top full */}
      <div className="relative w-full h-40 sm:h-48 md:h-52 lg:h-56">
        <Image
          src={userData?.avatarUrl || "/default-avatar.jpg"}
          alt={userData?.username || "Avatar người dùng"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          priority
        />
      </div>

      {/* Info + Button */}
      <div className="p-3 text-center text-black dark:text-white">
        <p className="font-semibold truncate hover:underline cursor-pointer">
          <Link href={`/profile/${userData?.username}`}>
            {userData?.firstName} {userData?.lastName}
          </Link>
        </p>
        {customButton && (
          <p>
            Có {friend?.user?.mutualFriendsCount} bạn chung
          </p>
        )}

        <div className="mt-3 flex flex-col space-y-2">
          {customButton ? (
            <button
              onClick={handleAccept}
              disabled={isAcceptting || isRejecting}
              className={`${customButton.bgColor} ${customButton.hoverColor} text-white py-1.5 rounded font-medium`}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-medium"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isAcceptting || isRejecting}
                    className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-white py-1.5 rounded font-medium"
                  >
                    Xóa
                  </button>
                </>
              ) : type === "SENT" ? (
                <button
                  className="bg-green-500 text-white py-1.5 rounded font-medium cursor-not-allowed"
                  disabled
                >
                  Đã gửi lời mời
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
