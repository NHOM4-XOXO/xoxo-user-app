"use client";

import { useState } from "react";
import GroupDetailSidebar from "./GroupDetailSidebar";
import GroupDetailContent from "./GroupDetailContent";

// Mock data cho nhóm
const groupData = {
  id: 1,
  name: "TỰ HỌC GUITAR - PIANO VÀ UKULELE",
  coverImage: "https://picsum.photos/800/300?random=1",
  members: "501.2K thành viên",
  isPublic: true,
  description: "Nhóm Công khai • 501,2K thành viên",
  memberAvatars: [
    "https://picsum.photos/40/40?random=1",
    "https://picsum.photos/40/40?random=2",
    "https://picsum.photos/40/40?random=3",
    "https://picsum.photos/40/40?random=4",
    "https://picsum.photos/40/40?random=5",
  ],
};

export default function GroupDetailLayout({ groupId }) {
  const [activeTab, setActiveTab] = useState("discussion");

  return (
    <div className="min-h-screen bg-gray-700">
      <div className="max-w-full -mx-5 px-5 py-6">
        <div className="flex gap-12 ">
          {/* Left Sidebar */}
          <div className="w-80 ">
            <GroupDetailSidebar group={groupData} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <GroupDetailContent
              group={groupData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Giới thiệu</h3>
              <p className="text-gray-600 text-sm mb-4">
                Nơi dành cho tất cả các bạn thích giao lưu âm nhạc, cũng như
                nghệ nhạc và cùng nhau học hỏi.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <div>
                    <div className="font-medium text-gray-500">Công khai</div>
                    <div>
                      Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và
                      những gì họ đăng.
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>👁️</span>
                  <div>
                    <div className="font-medium text-gray-900">Hiển thị</div>
                    <div>Ai cũng có thể tìm thấy nhóm này.</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>📍</span>
                  <div className="font-medium text-gray-900">Việt Nam</div>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                Tìm hiểu thêm
              </button>
            </div>

            {/* Recent Media */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                File phương tiện mới đây
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <img
                    key={i}
                    src={`/image/group${(i % 2) + 1}.jpg`}
                    alt={`Media ${i}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
