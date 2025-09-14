"use client";

import { useState } from "react";
import { useJoinGroupMutation } from "@/features/groupManageMentApi";
import { useRouter } from "next/navigation";

// Toast component
function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-5 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fadeIn
        ${type === "error" ? "bg-red-500 text-white"
            : type === "info" ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"}`}
      >
        {message}
      </div>
    </div>
  );
}

export default function GroupCard({ group }) {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();
  const [toast, setToast] = useState({ message: null, type: "info" });
  const router = useRouter();
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: "info" }), 3000);
  };

  const handleJoinGroup = async () => {
    try {
      const res = await joinGroup(group.id).unwrap();

      if (res?.data?.status === "PENDING") {
        showToast(`Đã gửi yêu cầu tham gia nhóm ${res?.data?.group?.title}, vui lòng chờ xét duyệt.`, "info");
      } else {
        showToast(`Tham gia nhóm ${res?.data?.group?.title} thành công!`, "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra, vui lòng thử lại!", err);
    }
  };

  return (
    <div className="relative rounded-xl shadow-sm border overflow-hidden bg-white dark:bg-fb-dark-primary">
      {/* Cover */}
      <img
        src={group.coverUrl || "/default-cover.jpg"}
        alt={group.title}
        className="w-full h-40 object-cover"
      />

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-base text-gray-900 dark:text-white hover:underline cursor-pointer" onClick={() => router.push(`/groups/${group.id}`)}>
          {group.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {group.memberCount} thành viên • {group.postCount} bài viết
        </p>

        {/* Join Button */}
        <button
          onClick={handleJoinGroup}
          disabled={isLoading}
          className={`w-full mt-2 py-2 rounded-lg font-medium transition
            ${isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"}
          `}
        >
          {isLoading ? "Đang xử lý..." : "Tham gia nhóm"}
        </button>
      </div>

      {/* Toast notification */}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
