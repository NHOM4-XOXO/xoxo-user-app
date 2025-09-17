import React from "react";
import Image from "next/image";
import { useAcceptRequestMutation, useRejectRequestMutation } from "@/features/friendshipApi";

const FriendRequestCard = ({ friend }) => {
  const [acceptRequest, { isLoading: isAcceptting }] = useAcceptRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();

  const handleAccept = async () => {
    try {
      await acceptRequest(friend.id).unwrap();
      console.log("Accepted:", friend.id);
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(friend.id).unwrap();
      console.log("Accepted:", friend.id);
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };
  return (
    <div className="rounded-lg overflow-hidden dark:bg-[#242526] shadow-md border border-gray-300 dark:border-gray-700 cursor-pointer">
      {/* Avatar top full */}
      <div className="relative w-full h-40 sm:h-48 md:h-52 lg:h-56">
        <Image
          src={friend.user.avatarUrl}
          alt={friend.user.username}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info + Button */}
      <div className="p-3 text-center text-black dark:text-white">
        <p className="font-semibold truncate">{friend.user.firstName} {friend.user.lastName}</p>
        <div className="mt-3 flex flex-col space-y-2">
          <button onClick={() => handleAccept()} className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-medium cursor-pointer">
            Xác nhận
          </button>
          <button onClick={() => handleReject()} className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-white py-1.5 rounded font-medium cursor-pointer">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
