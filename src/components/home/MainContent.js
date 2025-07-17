"use client";

import { useState } from "react";

export default function MainContent({ user }) {
  const [postText, setPostText] = useState("");

  const posts = [
    {
      id: 1,
      content:
        "Hộp báo nóng của Jack: mẹ Jack khẳng định TA tìm hiểu nhiều người chứ không phải mối Jack, cả 2 hoàn toàn không có thời gian sống thử",
      media: "/api/placeholder/500/300",
      likes: 120,
      comments: 34,
      shares: 12,
      timestamp: "2 giờ",
    },
  ];

  return (
    <div className="flex-1 max-w-2xl mx-auto p-4">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              placeholder={`${user.name} ơi, bạn đang nghĩ gì thế?`}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full resize-none border-none outline-none text-lg bg-gray-100 rounded-full px-4 py-2"
              rows={1}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <svg
                className="w-6 h-6 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">Ảnh/video</span>
            </button>
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">Cảm xúc/hoạt động</span>
            </button>
          </div>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
            Đăng
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            <p className="text-gray-900 mb-3">{post.content}</p>
          </div>

          {/* Post Image */}
          <div className="bg-red-500 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Hộp báo nóng của Jack: mẹ Jack khẳng định TA tìm hiểu nhiều người
              chứ không phải mối Jack, cả 2 hoàn toàn không có thời gian sống
              thử
            </h2>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
              <span>👍 {post.likes}</span>
              <span>
                {post.comments} bình luận • {post.shares} chia sẻ
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 flex-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>Thích</span>
              </button>
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 flex-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Bình luận</span>
              </button>
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 flex-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
