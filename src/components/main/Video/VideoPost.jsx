import { useState } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  UsersRound,
  Lock,
} from "lucide-react";
import MediaView from "../../common/MediaView";
import Divider from "@/components/common/Divider";
import ReactionPopup from "../Post/ReactionPopup";
import { useRouter } from "next/navigation";

export default function VideoPost({ post }) {
  const router = useRouter();

  const [likesCount, setLikesCount] = useState(post.likes);
  const [showFullContent, setShowFullContent] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const defaultReaction = {
    icon: <ThumbsUp />,
    name: "Thích",
  };
  const [selectedReaction, setSelectedReaction] = useState(defaultReaction);
  const [isLiked, setIsLiked] = useState(false);

  const handleViewDetails = () => {
    router.push(`/videos/${post.id}`); // Navigate to detailed video page
  };

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

  return (
    <div className="bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg shadow-md p-4 mb-6 text-black dark:text-white">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Image
            src={post.author.avatar || "/default-avatar.jpg"}
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
                  <span className="text-black dark:text-gray-500 text-sm">
                    ·
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer">
                    Theo dõi
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 space-x-1 font-bold">
              <span>{post.timestamp}</span>
              <span>·</span>
              {getPrivacyIcon(post.privacy)}
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-3 text-sm break-words">
        <p className={showFullContent ? "" : "line-clamp-3"}>{post.content}</p>
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

      {/* Media Viewer */}
      {post.media && post.media.length > 0 && (
        <div className="relative w-full rounded-lg overflow-hidden mb-3 cursor-pointer">
          <MediaView media={post.media} />
        </div>
      )}

      {/* Likes, Comments, Viewers Info */}
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
        <button
          onClick={handleViewDetails}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Bình luận</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary transition-colors cursor-pointer">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
