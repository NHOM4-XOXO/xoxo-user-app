import VideoPost from "@/components/main/Video/VideoPost";
import { allPosts } from "@/data/posts";

export default function WatchHome() {
  const filteredVideoPosts = allPosts.filter(
    (post) => post.media.length === 1 && post.media[0].type === "video"
  );

  return (
    <>
      {filteredVideoPosts.length === 0 ? (
        <p className="text-center text-gray-400 text-lg mt-10">
          Không có video công khai nào để hiển thị.
        </p>
      ) : (
        filteredVideoPosts.map((post) => (
          <VideoPost key={post.id} post={post} />
        ))
      )}
    </>
  );
}
