"use client";

import { useMemo, useState, useEffect } from "react";
import PostModal from "./PostModal";
import MainPost from "./MainPost";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import ReactionPopup from "./ReactionPopup";
import { useAddReactionMutation } from "@/features/postReactionApi";
import {
  useGetMyReactionQuery,
  useDeleteReactionPostMutation,
} from "@/features/postApi";

const Post = ({ data, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ destructure an toàn với default {}
  const { id, commentCount = 0 } = data?.post ?? {};

  // ✅ nếu commentCount chưa có thì về 0
  const [count, setCount] = useState(commentCount);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState({
    icon: <ThumbsUp />,
    name: "Thích",
    colorName: "",
  });
  const [isLiked, setIsLiked] = useState(false);

  // ✅ tránh gọi API khi id chưa sẵn sàng
  const { data: myReaction } = useGetMyReactionQuery(id, { skip: !id });

  const [addReactToPost] = useAddReactionMutation();
  const [deleteReactionPost] = useDeleteReactionPostMutation();

  useEffect(() => {
    if (!myReaction) return;

    // map reaction từ API về UI
    switch (myReaction.reactionType) {
      case "LIKE":
        setSelectedReaction({
          name: "Thích",
          icon: <ThumbsUp />,
          colorName: "text-blue-600",
        });
        setIsLiked(true);
        break;
      case "LOVE":
        setSelectedReaction({
          name: "Yêu thích",
          icon: myReaction.emoji, // giả sử backend trả về emoji string
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
      case "SAD": // ✅ case trước bị lặp "HAHA"
        setSelectedReaction({
          name: "Buồn",
          icon: myReaction.emoji,
          colorName: "text-yellow-500",
        });
        setIsLiked(true);
        break;
      case "ANGRY": // ✅ case trước bị lặp "HAHA"
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
      ? { ...data, commentCount: count } 
      : { post: undefined, commentCount: count };
  }, [data, count]);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white dark:bg-fb-dark-secondary p-4 space-y-3 shadow-sm">
        <MainPost data={renderData} isLoading />
      </div>
    );
  }

  // ✅ nếu chưa có id (data chưa tới) thì không render gì cả (hoặc bạn có thể trả về skeleton)
  if (!id) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white dark:bg-fb-dark-secondary p-4 space-y-3 shadow-sm">
      {/* Main post */}
      <MainPost key={id} data={renderData} />

      {/* Actions */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        {/* Like */}
        <div
          className="w-1/3 relative flex justify-center"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <button
            className={`w-full hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 rounded-md py-2 cursor-pointer text-xl ${
              selectedReaction?.colorName || ""
            }`}
            onClick={async () => {
              if (!id) return; // ✅ guard

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
                  icon: <ThumbsUp />,
                  name: "Thích",
                  colorName: "text-blue-600",
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
            className={`absolute -top-12 left-1/2 -translate-x-1/2 z-50 transition ease-in-out duration-500 ${
              showPopup
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
          <MessageCircle size={18} /> Bình luận ({count})
        </button>

        {/* Share */}
        <button className="w-1/3 hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer">
          <Share2 size={18} /> Chia sẻ
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PostModal
          post={renderData}
          isLoading={isLoading}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onCommentSuccess={() => setCount((prev) => prev + 1)}
        />
      )}
    </div>
  );
};

export default Post;
