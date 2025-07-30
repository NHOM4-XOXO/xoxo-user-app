"use client";

import { allPosts } from "@/data/posts";
import { useState } from "react";
import Post from "../main/Post/PostItem";

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
        <span className="text-sm text-gray-500">
          <strong>Hoạt động gần đây</strong>
        </span>
      </div>
      {/* Posts */}
      <div className="space-y-4">
        {allPosts.map((item, index) => (
          <Post key={index} data={item} />
        ))}
      </div>
    </div>
  );
}
