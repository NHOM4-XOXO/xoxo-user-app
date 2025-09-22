import { useState } from "react";
import { Dropdown } from "antd";
import { useTheme } from "next-themes";
import { MoreHorizontal, Users, Edit, Trash2, Flag, EyeOff } from "lucide-react";
import PostMediaGrid from "./PostMediaGrid";
import PostFooter from "./PostFooter";
import PostCreationModal from "../PostCreation/PostCreationModal";
import ReportModal from "@/components/report/ReportModal";
import { useDeletePostMutation } from "@/features/postApi";
import toast from "react-hot-toast";

const MainPost = ({ data, reactionStats, currentUserId }) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [deletePosst] = useDeletePostMutation();

  // Khởi tạo state cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false); 

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "image",
    }));
    setSelectedFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMenuClick = async ({ key }) => {
    console.log("Menu clicked:", key);
    // Thêm destructuring { key }
    if (key === "edit") {
      setEditingPost(data);
      setIsModalOpen(true);
    }
    if (key === "delete") {
      try {
        await deletePosst(data.post.id);
        toast.success("Xóa bài viết thành công.");
      } catch (error) {
        toast.error(
          "Xóa bài viết thất bại" + error?.data?.message
            ? `: ${error.data.message}`
            : "."
        );
      }
    }
    if (key === "report") {
      console.log("Opening report modal");
      setShowReportModal(true);
    }
    // if (key === "hide") {
    //   // Logic ẩn bài viết (nếu cần)
    //   toast.info("Đã ẩn bài viết");
    // }
  };
  if (!data) return null;

  const { post, media = [] } = data;

  const author = {
    id: post?.authorId,
    name:
      `${post?.authorFirstName || ""} ${post?.authorLastName || ""}`.trim() ||
      "Người dùng",
    avatar: post?.authorAvatarUrl,
  };

  const toggleCaption = () => setShowFullCaption(!showFullCaption);

  const menuItems = {
    items:
      currentUserId === author.id
        ? [
            {
              key: "edit",
              icon: <Edit size={16} />,
              label: (
                <p className="text-sm font-semibold">Chỉnh sửa bài viết</p>
              ),
            },
            {
              key: "delete",
              icon: <Trash2 size={16} />,
              label: (
                <p className="text-sm font-semibold text-red-500">
                  Xóa bài viết
                </p>
              ),
            },
          ]
        : [
            {
              key: "report",
              icon: <Flag size={16} />,
              label: (
                <p className="text-sm font-semibold text-red-500">
                  Báo cáo bài viết
                </p>
              ),
            },
            {
              key: "hide",
              icon: <EyeOff size={16} />,
              label: <p className="text-sm font-semibold">Ẩn bài viết</p>,
            },
          ],
    onClick: handleMenuClick,
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-2">
          <img
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-fb-dark-quaternary"
            src={author.avatar}
            alt="Avatar"
          />
          <div>
            <h1 className="font-bold text-sm dark:text-white cursor-pointer hover:underline">
              {author.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              {post?.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              <Users className="w-3 h-3" />
            </p>
          </div>
        </div>
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName={isDark ? "custom-dropdown" : ""}
          menu={menuItems}
          arrow={{ pointAtCenter: true }}
        >
          <button type="button">
            <MoreHorizontal className="text-gray-500 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-fb-dark-tertiary rounded-full p-1 w-7 h-7" />
          </button>
        </Dropdown>
      </div>

      {/* Caption */}
      <div className="px-2 text-gray-700 dark:text-gray-300 text-sm">
        <p className={showFullCaption ? "" : "line-clamp-2"}>
          {post?.content || ""}
        </p>
        {post?.content && post.content.length > 100 && (
          <button
            onClick={toggleCaption}
            className="text-blue-500 text-sm mt-1 hover:underline"
          >
            {showFullCaption ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      {/* Media */}
      {media.length > 0 && <PostMediaGrid media={media} postId={post?.id} />}

      {/* Reactions */}
      <PostFooter
        post={{ ...post, commentCount: data?.post.commentCount }}
        reactionStats={reactionStats}
      />

      {/*Modal */}
      <PostCreationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
          setSelectedFiles([]);
          setPostContent("");
        }}
        editingPost={editingPost}
        postContent={postContent}
        setPostContent={setPostContent}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        handleFileSelect={handleFileSelect}
        removeFile={removeFile}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="POST"
        targetId={post?.id}
      />
    </>
  );
};

export default MainPost;
