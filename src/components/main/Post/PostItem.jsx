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
  useAddReactionMutation,
} from "@/features/postApi";

//helper: update local reaction stats
function updateLocalReactionStats(prev, oldType, newType) {
  if (!prev) {
    return {
      totalReactions: newType ? 1 : 0,
      reactionBreakdown: newType ? { [newType]: 1 } : {},
    };
  }

  const breakdown = { ...prev.reactionBreakdown };

  // trừ reaction cũ
  if (oldType && breakdown[oldType]) {
    if (breakdown[oldType] > 1) breakdown[oldType] -= 1;
    else delete breakdown[oldType];
  }

  // cộng reaction mới
  if (newType) {
    breakdown[newType] = (breakdown[newType] || 0) + 1;
  }

  const total =
    prev.totalReactions +
    (newType ? 1 : 0) -
    (oldType ? 1 : 0);

  return {
    ...prev,
    totalReactions: Math.max(total, 0),
    reactionBreakdown: breakdown,
  };
}

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

  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const currentUserId = profile?.id;

  const [localReactionStats, setLocalReactionStats] = useState(null);

  // đồng bộ stats từ API
  useEffect(() => {
    if (reactionStats) setLocalReactionStats(reactionStats);
  }, [reactionStats]);

  // set trạng thái ban đầu của reaction
  useEffect(() => {
    if (!myReaction) {
      setSelectedReaction({ name: "Thích", icon: <ThumbsUp />, colorName: "" });
      setIsLiked(false);
      return;
    }

    const type = myReaction.reactionType;
    setIsLiked(true);
    switch (type) {
      case "LIKE":
        setSelectedReaction({
          type,
          name: "Thích",
          icon: myReaction.emoji || <ThumbsUp />,
          colorName: "text-yellow-600",
        });
        break;
      case "LOVE":
        setSelectedReaction({
          type,
          name: "Yêu thích",
          icon: myReaction.emoji,
          colorName: "text-red-500",
        });
        break;
      case "HAHA":
        setSelectedReaction({
          type,
          name: "Haha",
          icon: myReaction.emoji,
          colorName: "text-yellow-400",
        });
        break;
      case "WOW":
        setSelectedReaction({
          type,
          name: "Wow",
          icon: myReaction.emoji,
          colorName: "text-yellow-300",
        });
        break;
      case "SAD":
        setSelectedReaction({
          type,
          name: "Buồn",
          icon: myReaction.emoji,
          colorName: "text-yellow-500",
        });
        break;
      case "ANGRY":
        setSelectedReaction({
          type,
          name: "Phẫn nộ",
          icon: myReaction.emoji,
          colorName: "text-red-600",
        });
        break;
      default:
        setSelectedReaction({ type, name: "Thích", icon: <ThumbsUp />, colorName: "" });
        setIsLiked(false);
    }
  }, [myReaction]);

  // handle click like
  const handleLike = async () => {
    if (!id) return;

    const oldType = selectedReaction?.type || null;
    const newType = isLiked ? null : "LIKE";

    // snapshot for rollback
    const prevSelected = selectedReaction;
    const prevIsLiked = isLiked;
    const prevStats = localReactionStats;

    // optimistic update
    setIsLiked(!!newType);
    setSelectedReaction(
      newType
        ? { type: "LIKE", name: "Thích", icon: "👍", colorName: "text-yellow-500" }
        : { type: null, name: "Thích", icon: <ThumbsUp />, colorName: "" }
    );
    setLocalReactionStats((prev) => updateLocalReactionStats(prev, oldType, newType));

    try {
      if (newType) {
        await addReactToPost({ postId: id, reactionType: "LIKE" }).unwrap();
      } else {
        await deleteReactionPost(id).unwrap();
      }
    } catch (err) {
      console.error("Reaction failed:", err);
      // rollback
      setSelectedReaction(prevSelected);
      setIsLiked(prevIsLiked);
      setLocalReactionStats(prevStats);
    }
  };

  const renderData = useMemo(() => (data ? { ...data } : { post: undefined }), [data]);

  if (!id) return null;

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
        reactionStats={localReactionStats}
        currentUserId={currentUserId}
      />

      {/* Actions */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        {/* Like */}
        <div
          className="w-full relative flex justify-center"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <button
            className={`w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 rounded-md py-2 cursor-pointer text-xl ${selectedReaction?.colorName || ""
              }`}
            onClick={handleLike}
          >
            {selectedReaction.icon}
            {selectedReaction.name}
          </button>

          {/* popup */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition ease-in-out duration-500 ${showPopup ? "flex opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            <ReactionPopup
              onSelect={async (reaction) => {
                if (!id) return;

                const oldType = selectedReaction?.type || null;
                const newType = reaction.type;

                const prevSelected = selectedReaction;
                const prevIsLiked = isLiked;
                const prevStats = localReactionStats;

                // optimistic update
                setSelectedReaction(reaction);
                setIsLiked(true);
                setLocalReactionStats((prev) => updateLocalReactionStats(prev, oldType, newType));

                try {
                  await addReactToPost({ postId: id, reactionType: newType }).unwrap();
                } catch (err) {
                  console.error("Reaction failed:", err);
                  // rollback
                  setSelectedReaction(prevSelected);
                  setIsLiked(prevIsLiked);
                  setLocalReactionStats(prevStats);
                }

                setShowPopup(false);
              }}
            />
          </div>
        </div>

        {/* Comment */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer"
        >
          <MessageCircle size={18} /> Bình luận ({commentCount})
        </button>

        {/* Share */}
        {currentUserId !== data?.post?.authorId && (<button
          onClick={() => setIsShareOpen(true)}
          className="w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer"
        >
          <Share2 size={18} /> Chia sẻ
        </button>)}
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
