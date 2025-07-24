"use client";

import { useState } from "react";

export default function GroupDetailContent({ groupId }) {
  const [activeTab, setActiveTab] = useState("discussion");

  // Mock data cho nhóm
  const groupData = {
    1: {
      name: "Học lập trình cùng nhau",
      members: "2.3K thành viên",
      description: "Nhóm chia sẻ kiến thức lập trình",
      coverImage: "https://via.placeholder.com/800x300/3b82f6/ffffff?text=Programming+Group",
    },
    2: {
      name: "Ẩm thực Việt Nam",
      members: "5.7K thành viên", 
      description: "Chia sẻ công thức và món ăn ngon",
      coverImage: "https://via.placeholder.com/800x300/10b981/ffffff?text=Vietnamese+Food",
    },
    3: {
      name: "Du lịch khắp thế giới",
      members: "8.1K thành viên",
      description: "Kinh nghiệm và hình ảnh du lịch",
      coverImage: "https://via.placeholder.com/800x300/f59e0b/ffffff?text=Travel+World",
    },
  };

  const group = groupData[groupId] || groupData[1];

  const posts = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatar: "https://via.placeholder.com/40x40/6366f1/ffffff?text=A",
      time: "2 giờ trước",
      content: "Chào mọi người! Mình vừa học xong React Hook, có ai có kinh nghiệm chia sẻ không?",
      likes: 12,
      comments: 8,
      image: null,
    },
    {
      id: 2,
      author: "Trần Thị B",
      avatar: "https://via.placeholder.com/40x40/ec4899/ffffff?text=B",
      time: "4 giờ trước",
      content: "Hôm nay mình làm thành công ứng dụng đầu tiên với Next.js! Cảm ơn nhóm đã hỗ trợ 🎉",
      likes: 24,
      comments: 15,
      image: "https://via.placeholder.com/500x300/3b82f6/ffffff?text=Next.js+App",
    },
    {
      id: 3,
      author: "Lê Văn C",
      avatar: "https://via.placeholder.com/40x40/10b981/ffffff?text=C",
      time: "1 ngày trước",
      content: "Có ai biết cách tối ưu performance cho React app không? Ứng dụng của mình đang chạy hơi chậm.",
      likes: 18,
      comments: 22,
      image: null,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Group Cover & Info */}
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
        <div 
          className="h-60 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${group.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4">🔒 Nhóm riêng tư</span>
            <span>{group.members}</span>
          </div>
          <p className="text-gray-700 mb-4">{group.description}</p>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium">
              ➕ Đã tham gia
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium">
              💬 Mời bạn bè
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium">
              🔔 Thông báo
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="border-b border-gray-200">
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
      </div>

      {/* Content based on active tab */}
      {activeTab === "discussion" && (
        <div className="space-y-4">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex space-x-3">
              <img
                src="https://via.placeholder.com/40x40/6366f1/ffffff?text=U"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  placeholder="Bạn đang nghĩ gì?"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-4">
                    <button className="text-gray-600 hover:text-blue-600">📷 Ảnh/Video</button>
                    <button className="text-gray-600 hover:text-blue-600">📁 Tệp</button>
                    <button className="text-gray-600 hover:text-blue-600">📊 Thăm dò</button>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{post.author}</h4>
                  <p className="text-sm text-gray-600">{post.time}</p>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4">{post.content}</p>
              
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <span>👍</span>
                    <span>Thích ({post.likes})</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <span>💬</span>
                    <span>Bình luận ({post.comments})</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <span>↗️</span>
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "members" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Thành viên của nhóm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((member) => (
              <div key={member} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <img
                  src={`https://via.placeholder.com/50x50/6366f1/ffffff?text=${member}`}
                  alt={`Member ${member}`}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Thành viên {member}</h4>
                  <p className="text-sm text-gray-600">Thành viên từ 2024</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Nhắn tin</button>
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
              <h4 className="font-medium text-gray-900 mb-2">Workshop React Advanced</h4>
              <p className="text-sm text-gray-600 mb-2">📅 25/07/2025 lúc 19:00</p>
              <p className="text-gray-800">Học các kỹ thuật nâng cao trong React</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
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
                src={`https://via.placeholder.com/200x200/3b82f6/ffffff?text=Photo+${photo}`}
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
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  📄
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{file.name}</h4>
                  <p className="text-sm text-gray-600">{file.size} • {file.type}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">Tải xuống</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
