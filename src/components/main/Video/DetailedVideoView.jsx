"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  UsersRound,
  Lock,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { allPosts } from "@/data/posts";
import CommentSection from "./CommentSection";
import Divider from "../../common/Divider";
import { HEADER_HEIGHT } from "@/constants";
import ReactionPopup from "../Post/ReactionPopup";

export default function DetailedVideoView({ postId }) {
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const defaultReaction = {
    icon: <ThumbsUp />,
    name: "Thích",
  };
  const [selectedReaction, setSelectedReaction] = useState(defaultReaction);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const foundPost = allPosts.find((p) => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      setIsLiked(false); // Reset like state for new post
      setLikesCount(foundPost.likes);
    } else {
      // Handle post not found, e.g., redirect to 404 or video list
      router.push("/videos");
    }
  }, [postId, router]);

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <Globe className="w-3 h-3 text-gray-600 dark:text-gray-400" />;
      case "friends":
        return (
          <UsersRound className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        );
      case "onlyMe":
        return <Lock className="w-3 h-3 text-gray-600 dark:text-gray-400" />;
      default:
        return <Globe className="w-3 h-3 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full bg-fb-light-secondary dark:bg-fb-dark-primary text-black dark:text-white">
        Đang tải video...
      </div>
    );
  }

  const videoMedia = post.media?.find((m) => m.type === "video");

  return (
    <div
      className={`flex flex-col lg:flex-row max-h-[100vh-${HEADER_HEIGHT}px] h-full bg-fb-light-secondary dark:bg-fb-dark-primary text-black dark:text-white`}
    >
      {/* Left Section: Video Player */}
      <div className="relative flex-1 bg-black flex items-center justify-center">
        {/* Close Button */}
        <div className="absolute top-4 left-4 flex items-center space-x-4 z-10">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-500 dark:hover:bg-fb-dark-tertiary transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {videoMedia ? (
          <video
            src={videoMedia.url}
            poster={
              videoMedia.thumbnail || "/placeholder.svg?height=720&width=1280"
            }
            controls
            autoPlay
            preload="metadata"
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy video cho bài viết này.
          </div>
        )}
      </div>

      {/* Right Section: Post Details and Comments Sidebar */}
      <div
        className={`lg:w-1/4 h-[calc(100vh-56px)] flex-shrink-0 bg-fb-light-primary dark:bg-fb-dark-secondary border-l border-gray-300 dark:border-gray-700 flex flex-col`}
      >
        {/* Fixed top part: Post Header, Content, Likes/Comments/Shares Info, Action Buttons */}
        <div className="p-4">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Image
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-base text-black dark:text-white">
                    {post.author.name}
                  </span>
                  {post.author.isFollowing && (
                    <>
                      <span className="text-gray-500 text-sm">·</span>
                      <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer">
                        Theo dõi
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 space-x-1">
                  <span>{post.timestamp}</span>
                  <span className="text-gray-500 text-sm">·</span>
                  {getPrivacyIcon(post.privacy)}
                </div>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
              <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-3 text-sm text-black dark:text-white break-all">
            <p className={showFullContent ? "" : "line-clamp-3"}>
              {post.content}
            </p>
            {!showFullContent ? (
              post.content.length > 100 && ( // Simple check for "Xem thêm"
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline mt-1 cursor-pointer"
                >
                  Xem thêm
                </button>
              )
            ) : (
              <button
                onClick={() => setShowFullContent(false)}
                className="text-blue-600 dark:text-blue-400 hover:underline mt-1 cursor-pointer"
              >
                Ẩn bớt
              </button>
            )}
          </div>

          {/* Likes, Comments, Shares Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center space-x-2">
              <span className="hover:underline cursor-pointer">
                {likesCount} lượt thích
              </span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">
                {post.commentsCount} bình luận
              </span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">
                {post.views} lượt xem
              </span>
            </div>
          </div>

          <Divider />

          {/* Action Buttons */}
          <div className="flex -mx-4 px-4">
            <div
              className="w-1/3 relative flex justify-center"
              onMouseEnter={() => setShowPopup(true)}
              onMouseLeave={() => setShowPopup(false)}
            >
              <button
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer"
                onClick={() => {
                  if (isLiked) {
                    setSelectedReaction(defaultReaction); // bỏ thích
                    setIsLiked(false);
                  } else {
                    setSelectedReaction({
                      ...defaultReaction,
                      icon: <ThumbsUp className="text-blue-600" />,
                    }); // thích
                    setIsLiked(true);
                  }
                }}
              >
                {selectedReaction?.icon}
                <span className="font-medium">{selectedReaction?.name}</span>
              </button>

              <div
                className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition ease-in-out duration-500
                ${
                  showPopup
                    ? "flex opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <ReactionPopup
                  onSelect={(reaction) => {
                    setSelectedReaction(reaction);
                    setShowPopup(false); // ẩn popup sau khi chọn
                    setIsLiked(true);
                  }}
                />
              </div>
            </div>
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Bình luận</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* Comment Section - takes remaining height and handles its own scrolling */}
        <div className="flex-1 overflow-hidden">
          <CommentSection comments={post.comments} postId={post.id} />
        </div>
      </div>
    </div>
  );
}
