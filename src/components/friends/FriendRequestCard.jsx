import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  useAcceptRequestMutation,
  useDeleteFriendMutation,
  useDeleteRequestMutation,
  useGetCountMutualFriendQuery,
  useGetSentPendingQuery,
  useIsFriendQuery,
  useRejectRequestMutation,
  useSendRequestMutation,
} from "@/features/friendshipApi";
import { useGetUserByUsernameQuery } from "@/features/userApi";
import Link from "next/link";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";

const FriendRequestCard = ({ friend, type = null }) => {
  const [acceptRequest, { isLoading: isAccepting }] = useAcceptRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();
  const [deleteFriend, { isLoading: isDeletingFriend }] = useDeleteFriendMutation();
  const [deleteRequest, { isLoading: isDeletingRequest }] = useDeleteRequestMutation();
  const [sendRequest, { isLoading: isSentRequest }] = useSendRequestMutation();



  const isUserType = ["DELETE", "RECEIVED", "SUGGESTION"].includes(type);
  const username = isUserType ? friend?.user?.username : friend?.friend?.username;

  const { data: userData, isLoading: isUserLoading } = useGetUserByUsernameQuery(
    username,
    { skip: !username }
  );

  const { data: sentPending, isLoading: isLoadingSent, } = useGetSentPendingQuery(
    undefined,
    { skip: type !== "SUGGESTION" }
  );
  const { data: countMutualFriend, isLoading: isMutualLoading } =
    useGetCountMutualFriendQuery(userData?.id, { skip: !userData?.id });

  // kiểm tra đã gửi lời mời chưa (trường hợp SUGGESTION)
  const isSentPending = useMemo(() => {
    if (type !== "SUGGESTION") return false;
    return sentPending?.find(
      (item) => item.friend.id === userData?.id && item.status === "PENDING"
    );
  }, [sentPending, type, userData?.id]);

  const { data: checkIsFriend } = useIsFriendQuery(
    type === "DELETE" ? friend?.user?.id : skipToken
  );

  const [localRelation, setLocalRelation] = useState(type);

  useEffect(() => {
    if (type === "SUGGESTION" && isSentPending) {
      setLocalRelation("SENT");
    } else {
      setLocalRelation(type);
    }
  }, [type, isSentPending]);



  // ================== HANDLERS ==================
  const handleSendRequest = async () => {
    try {
      await sendRequest(userData.id).unwrap();
      toast.success(`Đã gửi lời mời kết bạn đến ${userData?.firstName} ${userData?.lastName}`);
      setLocalRelation("SENT");
    } catch (err) {
      toast.error(err?.data?.message || "Gửi lời mời kết bạn thất bại");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteRequest(type === "SUGGESTION" ? isSentPending?.id : friend.id).unwrap();
      toast.success("Đã hủy lời mời kết bạn");
      setLocalRelation("SUGGESTION");
    } catch (err) {
      toast.error("Hủy lời mời thất bại");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRequest(friend.id).unwrap();
      toast.success(`Đã chấp nhận lời mời kết bạn từ ${friend.user.displayName || friend.user.username}`);
      setLocalRelation("DELETE");
    } catch (err) {
      toast.error(err?.data?.message || "Chấp nhận lời mời kết bạn thất bại");
    }
  };
  const handleReject = async () => {
    try {
      await rejectRequest(friend.id).unwrap();
      toast.success(`Xóa lời mời kết bạn từ ${friend.user.displayName || friend.user.username}`);
      setLocalRelation("DELETE");
    } catch (err) {
      toast.error(err?.data?.message || "Xóa lời mời kết bạn thất bại");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await deleteFriend(checkIsFriend.friendshipId).unwrap();
      toast.success(`Đã hủy kết bạn với ${userData?.firstName} ${userData?.lastName}`);
      setLocalRelation("SUGGESTION");
    } catch (err) {
      toast.error(err?.data?.message || "Hủy kết bạn thất bại");
    }
  };


  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-white mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
  );

  // ================== UI ==================
  if (isUserLoading || isMutualLoading) {
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
      {/* Avatar */}
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
      <h3 className="font-semibold text-lg dark:text-white cursor-pointer hover:underline">
        <Link href={`/profile/${userData?.username}`}>
          {userData?.firstName} {userData?.lastName}
        </Link>
      </h3>

      {/* Bạn chung */}
      {!isMutualLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 min-h-[20px]">
          {countMutualFriend > 0 ? `${countMutualFriend} bạn chung` : ""}
        </p>
      )}


      {/* Nút */}
      <div className="mt-4 w-full space-y-2">
        {localRelation === "RECEIVED" && (
          <>
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
            >
              {isAccepting ? <LoadingSpinner /> : "Xác nhận"}
            </button>
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="w-full bg-gray-500 hover:bg-gray-400 text-white text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
            >
              {isRejecting ? <LoadingSpinner /> : "Xóa"}
            </button>
          </>
        )}

        {localRelation === "SENT" && (
          <button
            onClick={handleDeleteRequest}
            disabled={isDeletingRequest}
            className="w-full bg-red-500 hover:bg-red-400 text-white text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
          >
            {isDeletingRequest ? <LoadingSpinner /> : "Hủy lời mời"}
          </button>
        )}

        {localRelation === "DELETE" && (
          <button
            onClick={handleRemoveFriend}
            disabled={isDeletingFriend}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded-full transition-colors"
          >
            {isDeletingFriend ? <LoadingSpinner /> : "Hủy kết bạn"}
          </button>
        )}

        {localRelation === "SUGGESTION" && (
          <button
            onClick={handleSendRequest}
            disabled={isSentRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full transition-colors"
          >
            {isSentRequest ? <LoadingSpinner /> : "Thêm bạn"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FriendRequestCard;
