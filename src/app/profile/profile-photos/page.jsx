"use client";
import PostCreationModal from "@/components/main/PostCreation/PostCreationModal";
import { useState, useRef } from "react";


const ProfileImage = () => {
    // const tabs = ["Ảnh của bạn"];
    // const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef();

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const newFiles = files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video/") ? "video" : "image",
            file,
        }));

        setSelectedFiles(newFiles); // ghi đè thay vì nối thêm
        setIsModalOpen(true);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary flex flex-col p-4 space-y-4 shadow-sm border border-gray-200 dark:border-fb-dark-tertiary text-gray-800 dark:text-white">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Ảnh</h2>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-4">
                    {/* Upload Button */}
                    <label className="flex items-center justify-center border border-gray-300 rounded-lg bg-fb-light-tertiary dark:bg-fb-dark-tertiary text-gray-600 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#444] aspect-square w-full">
                        <span className="text-3xl font-light">+</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </label>

                    {/* Fake image list */}
                    {[...Array(10)].map((_, i) => (
                        <img
                            key={i}
                            className="w-full h-auto object-cover rounded-lg hover:brightness-95 cursor-pointer transition duration-200"
                            src={`https://picsum.photos/id/${110 + i}/200/200`}
                            alt={`Ảnh ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Modal hiển thị khi chọn file */}
            <PostCreationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedFiles([]);
                }}
                postContent={postContent}
                setPostContent={setPostContent}
                fileInputRef={fileInputRef}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                handleFileSelect={handleFileSelect}
                removeFile={removeFile}
            />
        </>
    );
};

export default ProfileImage;
