"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Bell,
  Palette,
  UserMinus,
  Shield,
  Archive,
  Trash2,
  ChevronDown,
  ChevronRight,
  Settings,
  Users,
  FileText,
  ALargeSmall,
} from "lucide-react";
import ScrollableContainer from "@/components/common/ScrollableContainer";

export default function MessagesChatInfo({ contact, onClose }) {
  const [expandedSections, setExpandedSections] = useState({
    chatSettings: true,
    privacy: false,
    media: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const mediaFiles = [
    { id: 1, type: "image", url: "/image/georgina.jpg", name: "image1.jpg" },
    { id: 2, type: "image", url: "/image/group1.jpg", name: "image2.jpg" },
    { id: 3, type: "image", url: "/image/group2.jpg", name: "image3.jpg" },
    { id: 4, type: "file", name: "document.pdf", size: "2.5 MB" },
    { id: 5, type: "file", name: "presentation.pptx", size: "5.2 MB" },
  ];

  return (
    <div className="h-full py-3 pr-3">
      <div className="flex flex-col h-full overflow-hidden bg-fb-light-primary dark:bg-fb-dark-secondary rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-fb-dark-tertiary">
          <h2 className="text-lg font-semibold">Thông tin về đoạn chat</h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full cursor-pointer bg-fb-light-quaternary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ScrollableContainer className="flex-1 overflow-y-auto text-sm">
          {/* Contact Info */}
          <div className="p-6 text-center border-b border-fb-light-tertiary dark:border-fb-dark-tertiary">
            <Image
              src={contact.avatar || "/placeholder.svg"}
              alt={contact.name}
              width={80}
              height={80}
              className="mx-auto mb-3 rounded-full cursor-pointer hover:opacity-80"
            />
            <h3 className="mb-1 text-xl font-semibold cursor-pointer">
              {contact.name}
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {contact.isOnline
                ? "Đang hoạt động"
                : `Hoạt động ${contact.lastSeen || "2 phút"} trước`}
            </p>
            <div className="flex justify-center space-x-4">
              <button className="flex flex-col items-center p-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary">
                <div className="flex items-center justify-center w-10 h-10 mb-1 rounded-full bg-fb-light-secondary dark:bg-fb-dark-tertiary">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs">Trang cá nhân</span>
              </button>
              <button className="flex flex-col items-center p-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary">
                <div className="flex items-center justify-center w-10 h-10 mb-1 rounded-full bg-fb-light-secondary dark:bg-fb-dark-tertiary">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-xs">Tắt thông báo</span>
              </button>
              <button className="flex flex-col items-center p-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary">
                <div className="flex items-center justify-center w-10 h-10 mb-1 rounded-full bg-fb-light-secondary dark:bg-fb-dark-tertiary">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs">Tìm kiếm</span>
              </button>
            </div>
          </div>

          {/* Chat Settings */}
          <div className="mx-3 border-b border-fb-light-tertiary dark:border-fb-dark-tertiary">
            <button
              onClick={() => toggleSection("chatSettings")}
              className="flex items-center justify-between w-full px-3 py-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
            >
              <span className="font-medium">Tùy chỉnh đoạn chat</span>
              {expandedSections.chatSettings ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {expandedSections.chatSettings && (
              <div className="pb-4">
                <button className="flex items-center w-full px-4 py-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900">
                    <Palette className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Đổi chủ đề</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Thay đổi màu sắc và biểu tượng cảm xúc
                    </p>
                  </div>
                </button>
                <button className="flex items-center w-full px-4 py-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-300">
                    <ALargeSmall className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Thay đổi biệt danh</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Đặt biệt danh cho bạn bè
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Media & Files */}
          <div className="mx-3 border-b border-fb-light-tertiary dark:border-fb-dark-tertiary">
            <button
              onClick={() => toggleSection("media")}
              className="flex items-center justify-between w-full px-3 py-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
            >
              <span className="font-medium">File phương tiện & file</span>
              {expandedSections.media ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {expandedSections.media && (
              <div className="pb-4">
                <div className="px-4 mb-3">
                  <div className="grid grid-cols-3 gap-2">
                    {mediaFiles
                      .filter((file) => file.type === "image")
                      .map((file) => (
                        <div key={file.id} className="aspect-square">
                          <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="px-4 space-y-2">
                  {mediaFiles
                    .filter((file) => file.type === "file")
                    .map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center p-2 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg dark:bg-gray-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {file.size}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Support */}
          <div className="mx-3 border-b border-fb-light-tertiary dark:border-fb-dark-tertiary">
            <button
              onClick={() => toggleSection("privacy")}
              className="flex items-center justify-between w-full px-3 py-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
            >
              <span className="font-medium">Quyền riêng tư & hỗ trợ</span>
              {expandedSections.privacy ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {expandedSections.privacy && (
              <div className="pb-4">
                <button className="flex items-center w-full px-4 py-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span>Tắt thông báo</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span>Báo cáo</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <UserMinus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span>Chặn</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span>Lưu trữ đoạn chat</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 space-x-3 text-red-600 transition-colors rounded-lg cursor-pointer hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
                  <Trash2 className="w-5 h-5" />
                  <span>Xóa đoạn chat</span>
                </button>
              </div>
            )}
          </div>
        </ScrollableContainer>
      </div>
    </div>
  );
}
