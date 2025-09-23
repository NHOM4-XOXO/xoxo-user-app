"use client";

import { useMemo, useState, useEffect } from "react";
import PostModal from "./PostModal";
import ShareModal from "./ShareModal";
import MainPost from "./MainPost";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import ReactionPopup from "./ReactionPopup";
import {
  useGetMyReactionQuery,
  useDeleteReactionPostMutation,
  useGetReactionStatisticsQuery,
  useAddReactionMutation
} from "@/features/postApi";

const Post = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, commentCount } = data?.post || {};
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState({
    icon: <ThumbsUp />,
    name: "Thích",
  });
  const [isLiked, setIsLiked] = useState(false);

  // RTK query
  const { data: myReaction, isLoading: isMyReactionLoading } =
    useGetMyReactionQuery(id, { skip: !id });
  const { data: reactionStats, isLoading: isReactionStatsLoading } =
    useGetReactionStatisticsQuery(id, { skip: !id });
  const isLoading = isMyReactionLoading || isReactionStatsLoading;

  const [addReactToPost] = useAddReactionMutation();
  const [deleteReactionPost] = useDeleteReactionPostMutation();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // lấy user hiện tại từ localStorage
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const currentUserId = profile?.id;

  // mapping reaction từ API
  useEffect(() => {
    if (!myReaction) {
      setSelectedReaction({ name: "Thích", icon: <ThumbsUp />, colorName: "" });
      setIsLiked(false);
      return;
    }

    switch (myReaction.reactionType) {
      case "LIKE":
        setSelectedReaction({
          name: "Thích",
          icon: myReaction.emoji || <ThumbsUp />,
          colorName: "text-yellow-600",
        });
        setIsLiked(true);
        break;
      case "LOVE":
        setSelectedReaction({
          name: "Yêu thích",
          icon: myReaction.emoji,
          colorName: "text-red-500",
        });
        setIsLiked(true);
        break;
      case "HAHA":
        setSelectedReaction({
          name: "Haha",
          icon: myReaction.emoji,
          colorName: "text-yellow-400",
        });
        setIsLiked(true);
        break;
      case "WOW":
        setSelectedReaction({
          name: "Wow",
          icon: myReaction.emoji,
          colorName: "text-yellow-300",
        });
        setIsLiked(true);
        break;
      case "SAD":
        setSelectedReaction({
          name: "Buồn",
          icon: myReaction.emoji,
          colorName: "text-yellow-500",
        });
        setIsLiked(true);
        break;
      case "ANGRY":
        setSelectedReaction({
          name: "Phẫn nộ",
          icon: myReaction.emoji,
          colorName: "text-red-600",
        });
        setIsLiked(true);
        break;
      default:
        setSelectedReaction({
          name: "Thích",
          icon: <ThumbsUp />,
          colorName: "",
        });
        setIsLiked(false);
    }
  }, [myReaction]);
  const renderData = useMemo(() => {
    return data
      ? { ...data }
      : { post: undefined };
  }, [data]);

  // nếu chưa có id => không render
  if (!id) return null;

  // skeleton trong lúc loading
  if (isLoading) {
    return (
      <div className="bg-fb-light dark:bg-fb-dark rounded-xl shadow p-4 mb-4 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex-1">
            <div className="w-32 h-3 rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
            <div className="w-20 h-2 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="w-full h-3 rounded bg-gray-300 dark:bg-gray-700"></div>
          <div className="w-5/6 h-3 rounded bg-gray-300 dark:bg-gray-700"></div>
          <div className="w-4/6 h-3 rounded bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div className="w-full h-52 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
      </div>
    );
  }


  return (
    <div className="rounded-lg bg-white dark:bg-fb-dark-secondary p-4 space-y-3 shadow-sm">
      {/* Main post */}
      <MainPost
        key={id}
        data={renderData}
        reactionStats={reactionStats}
        currentUserId={currentUserId}
      />

      {/* Actions */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        {/* Like */}
        <div
          className="w-1/3 relative flex justify-center"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <button
            className={`w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 rounded-md py-2 cursor-pointer text-xl ${selectedReaction?.colorName || ""
              }`}
            onClick={async () => {
              if (!id) return;
              if (isLiked) {
                setSelectedReaction({
                  icon: <ThumbsUp />,
                  name: "Thích",
                  colorName: "",
                });
                setIsLiked(false);
                try {
                  await deleteReactionPost(id).unwrap();
                } catch (err) {
                  console.error("Remove like failed:", err);
                }
              } else {
                setSelectedReaction({
                  icon: "👍",
                  name: "Thích",
                  colorName: "text-yellow-500",
                });
                setIsLiked(true);
                try {
                  await addReactToPost({
                    postId: id,
                    reactionType: "LIKE",
                  }).unwrap();
                } catch (err) {
                  console.error("Like failed:", err);
                }
              }
            }}
          >
            {selectedReaction.icon}
            {selectedReaction.name}
          </button>

          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition ease-in-out duration-500 ${showPopup
              ? "flex opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            <ReactionPopup
              onSelect={async (reaction) => {
                if (!id) return;
                setSelectedReaction(reaction);
                setShowPopup(false);
                setIsLiked(true);
                try {
                  await addReactToPost({
                    postId: id,
                    reactionType: reaction.type,
                  }).unwrap();
                } catch (err) {
                  console.error("Reaction failed:", err);
                }
              }}
            />
          </div>
        </div>

        {/* Comment */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer"
        >
          <MessageCircle size={18} /> Bình luận ({commentCount})
        </button>

        {/* Share */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer"
        >
          <Share2 size={18} /> Chia sẻ
        </button>
      </div>

      {/* Comment Modal */}
      {isModalOpen && (
        <PostModal
          post={renderData}
          isLoading={isLoading}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          reactionStats={reactionStats}
        />
      )}

      {/* Share Modal */}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          post={data}
        />
      )}
    </div>
  );
};

export default Post;
