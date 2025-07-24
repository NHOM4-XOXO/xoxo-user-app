"use client";

import { useState } from "react";

const posts = [
  {
    id: 1,
    groupName: "SHOPEE GROUP - Cộng đồng Shopee Việt Nam",
    groupImage: "/image/group1.jpg",
    author: "Người tham gia ấn danh",
    authorAvatar: "/default-avatar.jpg",
    timeAgo: "14 phút",
    content: "Ối dồi ôi, ối dồi ơi....😭",
    hasImage: true,
    imageUrl: "/image/group1.jpg",
    likes: 24,
    comments: 8,
    shares: 2,
  },
];

export default function GroupsFeed() {
  const [postContent, setPostContent] = useState("");

  return (
    <div className="space-y-6 p-48 -mt-42">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500"><strong>Hoạt động gần đây</strong></span>
      </div>
      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border border-gray-200 rounded-lg p-4">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={post.groupImage}
                  alt={post.groupName}
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-sm text-blue-600">
                    {post.groupName}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.timeAgo}</span>
                    <span>•</span>
                    <span>🌍</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-3">{post.content}</p>

            {/* Post Image */}
            {post.hasImage && (
              <div className="mb-3">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <span>👍</span>
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <span>💬</span>
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <span>↗️</span>
                  <span className="text-sm">{post.shares}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
