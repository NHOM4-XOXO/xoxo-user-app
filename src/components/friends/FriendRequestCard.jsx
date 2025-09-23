import React from "react";
import Image from "next/image";
import { useAcceptRequestMutation, useDeleteFriendMutation, useDeleteRequestMutation, useIsFriendQuery, useRejectRequestMutation } from "@/features/friendshipApi";
import { useGetUserByUsernameQuery } from "@/features/userApi";
import Link from "next/link";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";

const FriendRequestCard = ({ friend, customButton, type = null }) => {
  const [acceptRequest, { isLoading: isAcceptting }] = useAcceptRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();
  const [deleteFriend, { isLoading: isDeleting }] = useDeleteFriendMutation();
  const username = type === "SENT" || "DELETE" ? friend?.user?.username : friend?.friend?.username;
  const { data: userData, isLoading: isUserLoading } = useGetUserByUsernameQuery(
    username,
    { skip: !username }
  );
  console.log(friend);

  const { data: checkIsfriend } = useIsFriendQuery(
    type === "DELETE" ? friend?.user?.id : skipToken
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
    try {
      await rejectRequest(friend.id).unwrap();
      toast.success("Đã xóa lời mời kết bạn");
    } catch (err) {
      toast.error("Xóa lời mời thất bại");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteRequest(friend.id).unwrap();
      toast.success("Đã hủy lời mời kết bạn");
    } catch (err) {
      toast.error("Hủy lời mời thất bại");
    }
  };



  const handleRemoveFriend = async () => {
    if (!checkIsfriend?.friendshipId) {
      toast.error("Không tìm thấy quan hệ bạn bè");
      return;
    }

    try {
      await deleteFriend(checkIsfriend.friendshipId).unwrap();
      toast.success(
        `Đã hủy kết bạn với ${friend?.user?.displayName || friend?.user?.username}`
      );
    } catch (err) {
      toast.error(err?.data?.message || "Hủy kết bạn thất bại");
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Xác nhận
                </button>
                <button
                  onClick={handleReject}
                  disabled={isAcceptting || isRejecting}
                  className="w-full bg-gray-500  hover:bg-gray-400 text-white text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Xóa
                </button>
              </>
            ) : type === "SENT" ? (
              <button
                onClick={handleDeleteRequest}
                className="w-full bg-red-500 hover:bg-red-400 text-white text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
              >
                Hủy lời mời
              </button>
            ) : type === "DELETE" ? (
              <button
                onClick={() => handleRemoveFriend()}
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded-full transition-colors"
              >
                Hủy kết bạn
              </button>
            ) : null
            }
          </>
        )}
      </div>
    </div>
  );
};

export default FriendRequestCard;
