"use client";

import { useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { allPosts } from "@/data/posts";

import Divider from "../../common/Divider";
import ReactionPopup from "../Post/ReactionPopup";
import CommentSection from "../Video/CommentSection";
import useMergeState from "../../../hooks/useMergeState";

export default function DetailedVideoView({ postId }) {
  const router = useRouter();

  const defaultReaction = {
    icon: <ThumbsUp />,
    name: "Thích",
  };

  const [state, setState] = useMergeState({
    post: null,
    likesCount: 0,
    showFullContent: false,
    showPopup: false,
    selectedReaction: defaultReaction,
    isLiked: false,
    currentIndex: 0,
  });

  const {
    post,
    likesCount,
    showFullContent,
    showPopup,
    selectedReaction,
    isLiked,
    currentIndex,
  } = state;

  useEffect(() => {
    const foundPost = allPosts.find((p) => p.id === postId);
    if (foundPost) {
      setState({
        post: foundPost,
        isLiked: false,
        likesCount: foundPost.likes,
        currentIndex: 0,
      });
    } else {
      router.push("/videos");
    }
  }, [postId, router, setState]);

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

  const media = post.media || [];
  const currentMedia = media[currentIndex];
  const multiple = media.length > 1;

  const showPrev = () =>
    setState({
      currentIndex: (currentIndex - 1 + media.length) % media.length,
    });
  const showNext = () =>
    setState({ currentIndex: (currentIndex + 1) % media.length });

  return (
    <div
      className={`flex flex-col lg:flex-row max-h-[100vh-${HEADER_HEIGHT}px] h-full bg-fb-light-secondary dark:bg-fb-dark-primary text-black dark:text-white`}
    >
      {/* Left Section: Media Viewer */}
      <div className="relative flex-1 bg-black flex items-center justify-center">
        {/* Close Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-500 dark:hover:bg-fb-dark-tertiary transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Prev Button */}
        {multiple && (
          <button
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>
        )}

        {/* Media Content */}
        <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
          {currentMedia?.type === "video" ? (
            <video
              src={currentMedia.url}
              poster={
                currentMedia.thumbnail ||
                "/placeholder.svg?height=720&width=1280"
              }
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-full rounded-lg shadow-xl"
            />
          ) : (
            <img
              src={currentMedia.url}
              alt=""
              className="max-w-full max-h-full rounded-lg shadow-xl"
            />
          )}
        </div>

        {/* Next Button */}
        {multiple && (
          <button
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full"
            aria-label="Next"
          >
            <ChevronRight size={32} className="text-white" />
          </button>
        )}

        {/* Counter */}
        {multiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm z-10">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Right Section: Post Details */}
      <div className="lg:w-1/4 h-[calc(100vh-56px)] flex-shrink-0 bg-fb-light-primary dark:bg-fb-dark-secondary border-l border-gray-300 dark:border-gray-700 flex flex-col">
        <div className="p-4">
          {/* Header */}
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
                  <span className="font-semibold text-base">
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
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary">
              <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-3 text-sm break-all">
            <p className={showFullContent ? "" : "line-clamp-3"}>
              {post.content}
            </p>
            {post.content.length > 100 && (
              <button
                onClick={() => setState({ showFullContent: !showFullContent })}
                className="text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                {showFullContent ? "Ẩn bớt" : "Xem thêm"}
              </button>
            )}
          </div>

          {/* Reactions Info */}
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
              onMouseEnter={() => setState({ showPopup: true })}
              onMouseLeave={() => setState({ showPopup: false })}
            >
              <button
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
                onClick={() => {
                  setState({
                    isLiked: !isLiked,
                    selectedReaction: isLiked
                      ? defaultReaction
                      : {
                          ...defaultReaction,
                          icon: <ThumbsUp className="text-blue-600" />,
                        },
                  });
                }}
              >
                {selectedReaction.icon}
                <span className="font-medium">{selectedReaction.name}</span>
              </button>
              <div
                className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition duration-500
                ${
                  showPopup
                    ? "flex opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <ReactionPopup
                  onSelect={(reaction) => {
                    setState({
                      selectedReaction: reaction,
                      isLiked: true,
                      showPopup: false,
                    });
                  }}
                />
              </div>
            </div>
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Bình luận</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>
        </div>

        {/* Bình luận */}
        <div className="flex-1 overflow-hidden">
          <CommentSection comments={post.comments} postId={post.id} />
        </div>
      </div>
    </div>
  );
}
