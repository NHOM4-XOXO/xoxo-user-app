import React from "react";
import Image from "next/image";

const FriendRequestCard = ({ name, avatar }) => {
  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-[#242526] shadow-md border border-gray-300 dark:border-gray-700 cursor-pointer">
      {/* Avatar top full */}
      <div className="relative w-full h-40 sm:h-48 md:h-52 lg:h-56">
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info + Button */}
      <div className="p-3 text-center text-black dark:text-white ">
        <p className="font-semibold truncate">{name}</p>
        <div className="mt-3 flex flex-col space-y-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-medium cursor-pointer">
            Xác nhận
          </button>
          <button className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-white py-1.5 rounded font-medium cursor-pointer">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestCard;
