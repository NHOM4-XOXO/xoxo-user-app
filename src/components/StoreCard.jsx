"use client";

import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const StoreCard = ({ name, avatar, cover, follower, isVerified }) => {
  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-[#242526] shadow-md hover:shadow-lg transition-transform hover:scale-105 border border-gray-300 dark:border-gray-700 cursor-pointer">
      <div className="relative w-full h-40 sm:h-48 md:h-52 lg:h-56">
        <Image
          src={cover}
          alt={`Ảnh bìa của ${name}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative -mt-12 flex justify-center">
        <div className="relative w-20 h-20 rounded-full border-4 border-white dark:border-[#242526] shadow-md bg-white dark:bg-[#18191A]">
          <Image
            src={avatar}
            alt={`Ảnh đại diện của ${name}`}
            fill
            className="rounded-full object-cover"
            sizes="80px"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 text-center text-black dark:text-white">
        <div className="flex justify-center items-center gap-1 font-semibold text-base sm:text-lg">
          {name}
          {isVerified && (
            <FaCheckCircle className="text-blue-500 text-sm sm:text-base" />
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {follower.toLocaleString()} người theo dõi
        </p>

        <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-full font-medium w-full transition cursor-pointer">
          Xem cửa hàng
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
