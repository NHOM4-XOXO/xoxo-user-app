"use client";

import { useState } from "react";
import Post from "../main/Post/PostItem";
import { allPosts } from "@/data/posts";


export default function GroupsFeed() {
  const [postContent, setPostContent] = useState("");

  return (
<<<<<<< HEAD
    <div className="space-y-6 p-12 -mt-10">
=======
    <div className="space-y-6 p-48 -mt-42">
>>>>>>> e831905428471ab851098df54886f2b232d48738
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
