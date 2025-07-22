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
  UsersRound,
} from "lucide-react";

const PostCreationModal = ({
  isOpen,
  onClose,
  postContent,
  setPostContent,
  fileInputRef,
  selectedFiles,
  setSelectedFiles,
  handleFileSelect,
  removeFile,
}) => {
  const [privacyIndex, setPrivacyIndex] = useState(0); // index of privacy
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  const privacyOptions = [
    {
      value: "public",
      label: "Công khai",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      value: "friends",
      label: "Bạn bè",
      icon: <UsersRound className="w-5 h-5" />,
    },
    {
      value: "onlyMe",
      label: "Chỉ mình tôi",
      icon: <Lock className="w-5 h-5" />,
    },
  ];

  const handlePost = () => {
    // Handle post submission logic here
    console.log("Post content:", postContent);
    console.log("Selected files:", selectedFiles);
    console.log("Privacy:", privacyOptions[privacyIndex]);

    // Reset form and close modal
    setPostContent("");
    setSelectedFiles([]);
    onClose();
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
            className="p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src="/default-avatar.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-black dark:text-white font-medium">
                Minh Thắng
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                  className="flex items-center space-x-1 bg-fb-light-tertiary dark:bg-fb-dark-quaternary px-3 py-1 rounded-md text-sm text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  {privacyOptions[privacyIndex]?.icon}
                  <span>{privacyOptions[privacyIndex]?.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Privacy Dropdown */}
                {showPrivacyDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-fb-light-tertiary dark:bg-fb-dark-quaternary rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 z-10 min-w-[150px]">
                    {privacyOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setPrivacyIndex(index);
                          setShowPrivacyDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-white text-sm first:rounded-t-lg last:rounded-b-lg cursor-pointer"
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
            placeholder="Minh ơi, bạn đang nghĩ gì thế?"
            className="w-full bg-transparent text-black dark:text-white text-lg placeholder-gray-400 resize-none border-none outline-none min-h-[120px]"
            rows={5}
          />

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedFiles.map((fileObj, index) => (
                <div key={index} className="relative group">
                  {fileObj.type === "image" ? (
                    <img
                      src={fileObj.url || "/placeholder.svg"}
                      alt={`Selected ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={fileObj.url}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-gray-800/75 hover:bg-gray-800/100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
          <div className="bg-fb-light-primary dark:bg-fb-dark-secondary border border-gray-300 dark:border-gray-500 rounded-lg p-3">
            <div className="flex items-center md:justify-between">
              <span className="text-black dark:text-white font-medium hidden md:block">
                Thêm vào bài viết của bạn
              </span>
              <div className="flex items-center w-full md:w-auto justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-green-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer">
                  <Smile className="w-5 h-5 text-yellow-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer">
                  <MapPin className="w-5 h-5 text-red-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer">
                  <span className="text-lg">GIF</span>
                </button>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Button */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={handlePost}
            disabled={!postContent.trim() && selectedFiles.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;
