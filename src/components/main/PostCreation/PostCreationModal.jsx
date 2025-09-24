"use client";
import { useState, useRef, useEffect } from "react";
import {
  X,
  ChevronDown,
  ImageIcon,
  Users,
  Smile,
  MapPin,
  MoreHorizontal,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";
import { useUploadMediaMutation, useUploadMultipleMediaMutation } from "@/features/mediaApi";
import { useCreatePostMutation, useUpdatePostMutation } from "@/features/postApi";
import { useSelector } from "react-redux";

const PostCreationModal = ({
  isOpen,
  onClose,
  postContent,
  setPostContent,
  selectedFiles,
  setSelectedFiles,
  handleFileSelect,
  removeFile,
  editingPost = null,
}) => {
  const [privacyIndex, setPrivacyIndex] = useState(0);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const [mediaIds, setMediaIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadMedia] = useUploadMediaMutation();
  const [uploadMultipleMedia] = useUploadMultipleMediaMutation();
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  let profile;
  try {
    profile = JSON.parse(localStorage.getItem("profile"));
  } catch (e) {
    console.error("Không đọc được localStorage:", e);
    profile = null;
  }
  const displayName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || profile?.username || "Người dùng";



  const privacyOptions = [
    { value: "public", label: "Công khai", icon: <Globe className="w-5 h-5" /> },
    { value: "private", label: "Chỉ mình tôi", icon: <Lock className="w-5 h-5" /> },
  ];

  // Khi mở modal với bài viết cũ → đổ dữ liệu vào state
  useEffect(() => {
    if (editingPost) {
      setPostContent(editingPost?.post?.content || "");
      setMediaIds(editingPost?.media?.map((m) => m.id) || []);

      // map media cũ thành selectedFiles (để preview)
      setSelectedFiles(
        (editingPost.media || []).map((m) => ({
          id: m.id,
          url: m.mediaUrl, // backend trả về
          type: m.mediaType?.toLowerCase() || "image",
          file: null,
        }))
      );
    } else {
      setPostContent("");
      setMediaIds([]);
      setSelectedFiles([]);
    }
  }, [editingPost, setPostContent, setSelectedFiles]);


  // Upload file mới
  const handleUploadFiles = async (files = selectedFiles) => {
    if (!files) return [];
    const fileArray = Array.isArray(files) ? files : [files];

    const ids = [];

    for (const file of fileArray) {
      let rawFile = null;

      if (file instanceof File) {
        rawFile = file; // trường hợp push thẳng File
      } else if (file?.file instanceof File) {
        rawFile = file.file; // trường hợp đã wrap thành object {url, type, file}
      }

      if (rawFile) {
        let mediaType = "IMAGE";
        if (rawFile.type.startsWith("video/")) mediaType = "VIDEO";
        else if (rawFile.type.startsWith("audio/")) mediaType = "AUDIO";

        const res = await uploadMedia({ file: rawFile, mediaType }).unwrap();
        ids.push(res.id);

        setSelectedFiles((prev) =>
          prev.map((f) =>
            f === file
              ? {
                id: res.id,
                url: res.mediaUrl,
                type: mediaType.toLowerCase(),
                file: null, // sau khi upload thì bỏ file local đi
              }
              : f
          )
        );
      } else {
        // media cũ (edit) thì giữ nguyên
        if (file.id) ids.push(file.id);
      }
    }

    return ids;
  };

  /* ------------ Tạo post ------------ */
  const handlePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;

    try {
      setLoading(true);

      const uploadedIds = await handleUploadFiles(selectedFiles);
      console.log(uploadedIds);
      const payload = {
        content: postContent,
        status: privacyOptions[privacyIndex].value === "public" ? "ACTIVE" : "HIDDEN",
        type: "USER_POST",
        location: "",
        hashtags: "",
        isPublic: true,
        allowComments: true,
        allowLikes: true,
        allowShares: true,
        mediaIds: uploadedIds,
      };

      if (editingPost) {
        await updatePost({ postId: editingPost?.post.id, body: payload }).unwrap();
      } else {
        await createPost(payload).unwrap();
      }


      // Reset
      setPostContent("");
      setMediaIds([]);
      setSelectedFiles([]);
      setPrivacyIndex(0);
      onClose();
    } catch (err) {
      console.error("Lỗi tạo/chỉnh sửa post:", err);
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 mb-0">
      <div className="relative bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Overlay loading toàn modal */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Tạo bài viết
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={profile?.avatarUrl || "/default-avatar.jpg"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-black dark:text-white font-medium">
                {displayName}
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                  className="flex items-center space-x-1 bg-fb-light-tertiary dark:bg-fb-dark-quaternary px-3 py-1 rounded-md text-sm text-gray-500 dark:text-gray-300"
                >
                  {privacyOptions[privacyIndex]?.icon}
                  <span>{privacyOptions[privacyIndex]?.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPrivacyDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-fb-light-tertiary dark:bg-fb-dark-quaternary rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 z-10 min-w-[150px]">
                    {privacyOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setPrivacyIndex(index);
                          setShowPrivacyDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-white text-sm"
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Input */}
        <div className="p-4">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={`${profile?.lastName} ơi, bạn đang nghĩ gì thế?`}
            className="w-full bg-transparent text-black dark:text-white text-lg resize-none outline-none min-h-[120px]"
          />

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedFiles.map((fileObj, index) => (
                <div key={index} className="relative group">
                  {fileObj.type === "image" ? (
                    <img
                      src={fileObj.url}
                      alt={`Selected ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : fileObj.type === "video" ? (
                    <video
                      src={fileObj.url}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                  ) : (
                    <audio src={fileObj.url} controls className="w-full" />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-gray-800/75 hover:bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Add to Post Section */}
        <div className="px-4 pb-4">
          <div className="border border-gray-300 dark:border-gray-500 rounded-lg p-3 flex items-center justify-between">
            <span className="text-black dark:text-white font-medium hidden md:block">
              Thêm vào bài viết của bạn
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              >
                <ImageIcon className="w-5 h-5 text-green-500" />
              </button>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                <Users className="w-5 h-5 text-blue-500" />
              </button>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                <Smile className="w-5 h-5 text-yellow-500" />
              </button>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                <MapPin className="w-5 h-5 text-red-500" />
              </button>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          hidden
        />

        {/* Post Button */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={handlePost}
            disabled={!postContent.trim() && selectedFiles.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            {editingPost ? "Lưu thay đổi" : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;
