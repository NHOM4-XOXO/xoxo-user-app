import Link from "next/link";
import { Ghost } from "lucide-react";
import { HEADER_HEIGHT } from "@/constants";

export default function NotFound() {
  return (
    <div
      className={`flex flex-col items-center justify-center h-[calc(100vh-${HEADER_HEIGHT}px)] bg-background text-foreground p-4 overflow-hidden`}
    >
      <div className="flex flex-col items-center text-center max-w-md w-full">
        <div className="relative mb-8">
          <Ghost className="w-24 h-24 text-blue-500 dark:text-blue-400" />
        </div>

        <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Bạn hiện không xem được nội dung này
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          Lỗi này thường do chủ sở hữu chỉ chia sẻ nội dung với một nhóm nhỏ,
          thay đổi người được xem hoặc đã xóa nội dung.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Đi đến Bảng feed
        </Link>

        <Link
          href="#"
          className="text-blue-600 dark:text-blue-400 hover:underline text-base mt-4"
        >
          Truy cập Trung tâm trợ giúp
        </Link>
      </div>
    </div>
  );
}
