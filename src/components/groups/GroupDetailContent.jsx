"use client";

import { allPosts } from "@/data/posts";
import { useState } from "react";
import { useParams } from "next/navigation";
import Post from "../main/Post/PostItem";
import PostCreation from "../main/PostCreation";
import ScrollableContainer from "../common/ScrollableContainer";

export default function GroupDetailContent() {
  const [activeTab, setActiveTab] = useState("discussion");
  const params = useParams();
  const groupId = params.id;

  const groupData = {
    1: {
      name: "Học lập trình cùng nhau",
      members: "2.3K thành viên",
      description: "Nhóm chia sẻ kiến thức lập trình",
      coverImage:
        "https://via.placeholder.com/800x300/3b82f6/ffffff?text=Programming+Group",
      memberAvatars: [
        "https://picsum.photos/40/40?random=1",
        "https://picsum.photos/40/40?random=2",
        "https://picsum.photos/40/40?random=3",
        "https://picsum.photos/40/40?random=4",
        "https://picsum.photos/40/40?random=5",
        "https://picsum.photos/40/40?random=6",
        "https://picsum.photos/40/40?random=7",
        "https://picsum.photos/40/40?random=8",
        "https://picsum.photos/40/40?random=9",
        "https://picsum.photos/40/40?random=10",
        "https://picsum.photos/40/40?random=11",
        "https://picsum.photos/40/40?random=12",
        "https://picsum.photos/40/40?random=13",
        "https://picsum.photos/40/40?random=14",
        "https://picsum.photos/40/40?random=15",
      ],
    },
    2: {
      name: "Ẩm thực Việt Nam",
      members: "5.7K thành viên",
      description: "Chia sẻ công thức và món ăn ngon",
      coverImage:
        "https://via.placeholder.com/800x300/10b981/ffffff?text=Vietnamese+Food",
      memberAvatars: [
        "https://picsum.photos/40/40?random=1",
        "https://picsum.photos/40/40?random=2",
        "https://picsum.photos/40/40?random=3",
        "https://picsum.photos/40/40?random=4",
        "https://picsum.photos/40/40?random=5",
        "https://picsum.photos/40/40?random=6",
        "https://picsum.photos/40/40?random=7",
        "https://picsum.photos/40/40?random=8",
        "https://picsum.photos/40/40?random=9",
        "https://picsum.photos/40/40?random=10",
        "https://picsum.photos/40/40?random=11",
        "https://picsum.photos/40/40?random=12",
        "https://picsum.photos/40/40?random=13",
        "https://picsum.photos/40/40?random=14",
        "https://picsum.photos/40/40?random=15",
      ],
    },
    3: {
      name: "Du lịch khắp thế giới",
      members: "8.1K thành viên",
      description: "Kinh nghiệm và hình ảnh du lịch",
      coverImage:
        "https://via.placeholder.com/800x300/f59e0b/ffffff?text=Travel+World",
      memberAvatars: [
        "https://picsum.photos/40/40?random=1",
        "https://picsum.photos/40/40?random=2",
        "https://picsum.photos/40/40?random=3",
        "https://picsum.photos/40/40?random=4",
        "https://picsum.photos/40/40?random=5",
        "https://picsum.photos/40/40?random=6",
        "https://picsum.photos/40/40?random=7",
        "https://picsum.photos/40/40?random=8",
        "https://picsum.photos/40/40?random=9",
        "https://picsum.photos/40/40?random=10",
        "https://picsum.photos/40/40?random=11",
        "https://picsum.photos/40/40?random=12",
        "https://picsum.photos/40/40?random=13",
        "https://picsum.photos/40/40?random=14",
        "https://picsum.photos/40/40?random=15",
      ],
    },
  };
  const group = groupData[parseInt(groupId)] || groupData[1];
  console.log("groupId:", groupId);
  console.log("group:", group);


  const posts = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatar: "https://picsum.photos/800/300?random=0",
      time: "2 giờ trước",
      content:
        "Chào mọi người! Mình vừa học xong React Hook, có ai có kinh nghiệm chia sẻ không?",
      likes: 12,
      comments: 8,

      image: null,
    },
    {
      id: 2,
      author: "Trần Thị B",
      avatar: "https://picsum.photos/800/300?random",
      time: "4 giờ trước",
      content:
        "Hôm nay mình làm thành công ứng dụng đầu tiên với Next.js! Cảm ơn nhóm đã hỗ trợ 🎉",
      likes: 24,
      comments: 15,
      image: "https://picsum.photos/500/300?random=1",
    },
    {
      id: 3,
      author: "Lê Văn C",
      avatar: "https://picsum.photos/800/300?random=3",
      time: "1 ngày trước",
      content:
        "Có ai biết cách tối ưu performance cho React app không? Ứng dụng của mình đang chạy hơi chậm.",
      likes: 18,
      comments: 22,
      image: "https://picsum.photos/800/300?random=4",
    },
  ];

  return (
    <div className="max-w-12xl mx-2">
      {/* Group Cover & Info */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div
          className="h-60 bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://picsum.photos/800/300?random=5')`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-30"></div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {group.name}
          </h1>
          <div className="flex items-center text-gray-600 mb-2">
            <span className="mr-4">🔒 Nhóm riêng tư</span>
            <span>{group.members}</span>
          </div>
          <p className="text-gray-700 mb-2">{group.description}</p>
          <div className="flex items-center space-x-8 ">
            <div className="flex -space-x-1">
              {(group.memberAvatars || [])
                .slice(0, 15)
                .map((_avatar, index) => (
                  <img
                    key={index}
                    src={`https://picsum.photos/800/300?random=${index + 1}`}
                    alt={`Member`}
                    className="w-9 h-9 rounded-full border-2 border-white"
                  />
                ))}
            </div>
            <div className="flex space-x-3 ml-24">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                💬 Đã tham gia
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
                ➕ Mời bạn bè
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">
                🔔 Thông báo
              </button>
            </div>
          </div>
        </div>
        <hr className="border-gray-300" />
        <nav className="flex">
          <button
            onClick={() => setActiveTab("discussion")}
            className={`px-6 py-4 font-medium border-b-2 ${
              activeTab === "discussion"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Thảo luận
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-6 py-4 font-medium border-b-2 ${
              activeTab === "members"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Thành viên
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-4 font-medium border-b-2 ${
              activeTab === "events"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Sự kiện
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-6 py-4 font-medium border-b-2 ${
              activeTab === "photos"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Ảnh
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-6 py-4 font-medium border-b-2 ${
              activeTab === "files"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Tệp
          </button>
        </nav>
      </div>

      {activeTab === "discussion" && (
        <div className="flex gap-6">
          <div className="w-2/3 space-y-4">
            {/* Create Post */}
            <div className="bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg mb-4 md:mb-6 border-gray-700">
              <PostCreation />
            </div>

            {allPosts.map((item, index) => (
              <Post key={index} data={item} />
            ))}
          </div>

          <div className="w-1/3 sticky top-4 self-start">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Giới thiệu</h3>
              <p className="text-gray-600 text-md mb-4">
                Nơi dành cho tất cả các bạn thích giao lưu âm nhạc, cũng như
                nghệ nhạc và cùng nhau học hỏi.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-md text-gray-600">
                  <span>🔒</span>
                  <div>
                    <div className="font-medium text-gray-500">Công khai</div>
                    <div>
                      Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và
                      những gì họ đăng.
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-md text-gray-600">
                  <span>👁️</span>
                  <div>
                    <div className="font-medium text-gray-900">Hiển thị</div>
                    <div>Ai cũng có thể tìm thấy nhóm này.</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-md text-gray-600">
                  <span>📍</span>
                  <div className="font-medium text-gray-900">Việt Nam</div>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-md font-medium">
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
      )}

      {activeTab === "members" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Thành viên của nhóm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((member) => (
              <div
                key={member}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <img
                  src={`https://picsum.photos/800/300?random=${member}`}
                  alt={`Member ${member}`}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Thành viên {member}
                  </h4>
                  <p className="text-md text-gray-600">Thành viên từ 2024</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-md">
                  Nhắn tin
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sự kiện sắp tới</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Workshop React Advanced
              </h4>
              <p className="text-md text-gray-600 mb-2">
                📅 25/07/2025 lúc 19:00
              </p>
              <p className="text-gray-800">
                Học các kỹ thuật nâng cao trong React
              </p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-md hover:bg-blue-700">
                Tham gia
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "photos" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Ảnh của nhóm</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((photo) => (
              <img
                key={photo}
                src={`https://picsum.photos/200/300?random=${photo}`}
                alt={`Photo ${photo}`}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "files" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Tệp của nhóm</h3>
          <div className="space-y-3">
            {[
              { name: "React Tutorial.pdf", size: "2.3 MB", type: "PDF" },
              { name: "Javascript Guide.docx", size: "1.8 MB", type: "Word" },
              { name: "Project Template.zip", size: "5.2 MB", type: "ZIP" },
            ].map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  📄
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{file.name}</h4>
                  <p className="text-md text-gray-600">
                    {file.size} • {file.type}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-md">
                  Tải xuống
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <ScrollableContainer />
    </div>
  );
}
