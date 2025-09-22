"use client";
import { useRef, useState } from "react";
import { Video, ImageIcon, Smile } from "lucide-react";
import PostCreationModal from "./PostCreationModal";
import { useSelector } from "react-redux";

const PostCreation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  let profile;
  try {
    profile = JSON.parse(localStorage.getItem("profile"));
  } catch (e) {
    console.error("Không đọc được localStorage:", e);
    profile = null;
  }
  const lastName = profile?.lastName;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "audio",
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...files]);

    if (files.length > 0) {
      setIsModalOpen(true);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  if (lastName) {
    return (
      <>
        {/* Post Creation Bar */}
        <div className="bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg p-3 md:p-4 mb-4 md:mb-6 border-gray-700">
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <img
              src={profile?.avatarUrl || "/default-avatar.jpg"}
              alt="User Avatar"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80"
            />
            <input
              type="text"
              onClick={() => setIsModalOpen(true)}
              readOnly
              aria-multiline
              value={
                postContent
                  ? postContent.replace(/\n/g, " ")
                  : `${lastName} ơi, bạn đang nghĩ gì thế?`
              }
              className="flex-1 bg-fb-light-secondary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary text-gray-600 dark:text-gray-300 text-left px-3 md:px-4 py-2 md:py-3 rounded-full transition-colors text-sm md:text-base cursor-pointer"
            />
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-4 flex items-center justify-between space-x-1 md:space-x-0">
            <button className="flex items-center space-x-1 md:space-x-2 px-2 md:px-1 py-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary rounded-lg transition-colors flex-1 justify-center cursor-pointer">
              <Video className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 text-red-500" />
              <span className="text-xs md:text-sm font-medium">
                Video trực tiếp
              </span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-1 py-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary rounded-lg transition-colors flex-1 justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 text-green-500" />
              <span className="text-xs md:text-sm font-medium">Ảnh/video</span>
            </button>

            <button className="lg:flex items-center space-x-1 md:space-x-2 px-2 md:px-1 py-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary rounded-lg transition-colors flex-1 justify-center cursor-pointer hidden">
              <Smile className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 text-yellow-500" />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">
                Cảm xúc/hoạt động
              </span>
            </button>
          </div>
        </div>

        {/* Post Creation Modal */}
        <PostCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postContent={postContent}
          setPostContent={setPostContent}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleFileSelect={handleFileSelect}
          removeFile={removeFile}
          fileInputRef={fileInputRef}
        />
      </>
    );
  }
};

export default PostCreation;
