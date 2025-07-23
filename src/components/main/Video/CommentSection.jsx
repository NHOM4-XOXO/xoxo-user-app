"use client";

import { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import Image from "next/image";
import { MOBILE_NAVIGATION_HEIGHT } from "@/constants";

export default function CommentSection({ comments: initialComments, postId }) {
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // Stores the comment ID being replied to
  const [currentComments, setCurrentComments] = useState(initialComments);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState("most_relevant"); // most_relevant, newest, all
  const [isShowOptions, setIsShowOptions] = useState(true);

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      const newComment = {
        id: Date.now(),
        author: {
          name: "Minh Thắng", // Assuming current user is "Minh Thắng" for demo
          avatar: "/default-avatar.jpg?height=32&width=32",
        },
        content: newCommentText.trim(),
        timestamp: "Vừa xong",
        replies: [],
        likes: 0,
      };

      if (replyingTo) {
        // Add as a reply
        setCurrentComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === replyingTo
              ? { ...comment, replies: [...comment.replies, newComment] }
              : comment
          )
        );
      } else {
        // Add as a top-level comment
        setCurrentComments((prevComments) => [...prevComments, newComment]);
      }

      setNewCommentText("");
      setReplyingTo(null); // Clear replying state
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    // Optionally focus the input field
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
    // Implement actual sorting logic here if needed
  };

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`mt-2 flex space-x-2 ${isReply ? "ml-8" : ""}`}
    >
      <Image
        src={comment.author.avatar || "/placeholder.svg"}
        alt={comment.author.name}
        width={32}
        height={32}
        className="rounded-full w-8 h-8 object-cover hover:opacity-70 cursor-pointer"
      />
      <div className="flex-1">
        <div className="bg-fb-light-secondary dark:bg-fb-dark-tertiary rounded-xl p-2">
          <p className="font-semibold text-sm text-black dark:text-white">
            {comment.author.name}
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200 break-all">
            {comment.content}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
          <span>{comment.timestamp}</span>
          <button className="font-semibold hover:underline cursor-pointer">
            Thích
          </button>
          <button
            onClick={() => handleReplyClick(comment.id)}
            className="font-semibold hover:underline cursor-pointer"
          >
            Trả lời
          </button>
        </div>
        {comment.replies &&
          comment.replies.map((reply) => renderComment(reply, true))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full px-4 pb-4">
      <div onClick={() => setShowSortDropdown(false)}></div>
      {/* Comment Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-500 dark:text-white">
          Bình luận
        </h3>
        {isShowOptions ? (
          <button
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer"
            onClick={() => setIsShowOptions(false)}
          >
            Ẩn
          </button>
        ) : (
          <button
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer"
            onClick={() => setIsShowOptions(true)}
          >
            Xem tất cả
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="relative mb-4">
        {isShowOptions && (
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>
              {sortOption === "most_relevant"
                ? "Phù hợp nhất"
                : sortOption === "newest"
                ? "Mới nhất"
                : "Tất cả bình luận"}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
        {showSortDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-fb-light-primary dark:bg-fb-dark-secondary border border-fb-light-tertiary dark:border-fb-dark-tertiary rounded-lg shadow-lg z-10 w-64">
            <div className="p-2">
              <div className="mb-2">
                <button
                  onClick={() => handleSortChange("most_relevant")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-quaternary rounded-md cursor-pointer"
                >
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-white">
                    Phù hợp nhất
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Hiển thị bình luận của bạn bè và những bình luận có nhiều
                    lượt tương tác nhất trước tiên.
                  </p>
                </button>
              </div>
              <div className="mb-2">
                <button
                  onClick={() => handleSortChange("newest")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary rounded-md cursor-pointer"
                >
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-white">
                    Mới nhất
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Hiển thị tất cả bình luận, theo thứ tự là các bình luận mới
                    nhất trước tiên.
                  </p>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleSortChange("all")}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary rounded-md cursor-pointer"
                >
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-white">
                    Tất cả bình luận
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Hiển thị tất cả bình luận, bao gồm cả nội dung có thể là
                    spam.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-show">
        <div className="w-8/9">
          {currentComments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Chưa có bình luận nào.
            </p>
          ) : (
            currentComments.map((comment) => renderComment(comment))
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div
        className={`pb-[${MOBILE_NAVIGATION_HEIGHT}px] md:pb-0 mt-4 flex items-center justify-center space-x-3`}
      >
        <Image
          src="/default-avatar.jpg?height=32&width=32"
          alt="Your Avatar"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover hover:opacity-70 cursor-pointer"
        />
        <div className="flex-1 h-full relative">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder={
              replyingTo ? "Trả lời..." : "Bình luận dưới tên Minh Thắng"
            }
            rows={Math.min(6, newCommentText.split(/\n/g).length)}
            className="w-full scrollbar-show bg-gray-100 dark:bg-fb-dark-tertiary rounded-lg py-2 pl-4 pr-10 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-fb-light-tertiary dark:focus:ring-fb-dark-quaternary"
          />
          <button
            onClick={handleAddComment}
            disabled={!newCommentText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
