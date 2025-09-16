"use client";
import { useState, useRef } from "react";
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
} from "lucide-react";
import { useUploadMediaMutation, useUploadMultipleMediaMutation } from "@/features/mediaApi";
import { useCreatePostMutation } from "@/features/postApi";
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
}) => {
  const [privacyIndex, setPrivacyIndex] = useState(0);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const [mediaIds, setMediaIds] = useState([]);

  const fileInputRef = useRef(null);

  const [uploadMedia] = useUploadMediaMutation();
  const [uploadMultipleMedia] = useUploadMultipleMediaMutation();
  const [createPost] = useCreatePostMutation();
  const { profile } = useSelector((state) => state.auth);
  const displayName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || profile?.username || "Người dùng";

  const privacyOptions = [
    { value: "public", label: "Công khai", icon: <Globe className="w-5 h-5" /> },
    { value: "onlyMe", label: "Chỉ mình tôi", icon: <Lock className="w-5 h-5" /> },
  ];



  const handleUploadFiles = async () => {
    try {
      if (selectedFiles.length === 0) return [];

      let uploadedIds = [];

      if (selectedFiles.length === 1) {
        // Trường hợp 1 file → gọi uploadMedia
        const file = selectedFiles[0].file;

        let mediaType = "IMAGE";
        if (file.type.startsWith("video/")) mediaType = "VIDEO";
        else if (file.type.startsWith("audio/")) mediaType = "AUDIO";

        const res = await uploadMedia({ file, mediaType }).unwrap();

        // backend single trả về object { id, ... }
        uploadedIds.push(res.id);

      } else {
        // Trường hợp nhiều file → gọi uploadMultipleMedia
        const files = selectedFiles.map((f) => f.file);

        // Lấy mediaType theo file đầu tiên (giả sử đồng bộ IMAGE/VIDEO/AUDIO)
        let mediaType = "IMAGE";
        if (files[0].type.startsWith("video/")) mediaType = "VIDEO";
        else if (files[0].type.startsWith("audio/")) mediaType = "AUDIO";

        const res = await uploadMultipleMedia({ files, mediaType }).unwrap();

        // backend multiple trả về list [{ id, ... }]
        uploadedIds = res.map((m) => m.id);
      }

      setMediaIds(uploadedIds);
      return uploadedIds;
    } catch (err) {
      console.error("Upload media thất bại:", err);
      return [];
    }
  };


  /* ------------ Tạo post ------------ */
  const handlePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;

    try {
      let uploadedIds = mediaIds;
      if (selectedFiles.length > 0) {
        uploadedIds = await handleUploadFiles();
      }

      await createPost({
        content: postContent,
        status: "ACTIVE",
        type: "USER_POST",
        parentPostId: null,
        location: "",
        hashtags: "",
        isPublic: privacyOptions[privacyIndex].value === "public",
        allowComments: true,
        allowLikes: true,
        allowShares: true,
        mediaIds: uploadedIds,
      }).unwrap();

      // Reset form
      setPostContent("");
      setMediaIds([]);
      setSelectedFiles([]);
      setPrivacyIndex(0);
      onClose();
    } catch (err) {
      console.error("Lỗi tạo post:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;
