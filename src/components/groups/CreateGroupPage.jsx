"use client";

import { useState } from "react";
import { ArrowLeft, Camera, Globe, Lock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useCreateGroupMutation } from '@/features/groupManageMentApi';
import toast from "react-hot-toast";


export default function CreateGroupPage() {
  const router = useRouter();
  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    privacy: "PRIVATE", // API yêu cầu viết hoa
    inviteFriends: false,
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        title: formData.groupName,
        description: formData.description,
        coverUrl: formData.coverImage
          ? URL.createObjectURL(formData.coverImage)
          : "/default-avatar.png",
        privacy: formData.privacy.toUpperCase(),
        rules: "string",
        tags: "string",
        location: "string",
        website: "string",
      };

      const res = await createGroup(body).unwrap();

      toast.success(`Tạo nhóm "${formData.groupName}" thành công! 🎉`);
      router.push(`/groups/${res.data.id}`);
      setTimeout(() => {
      router.push(`/groups/${res.data.id}`);
    }, 2000);
    } catch (err) {
      console.error("Create group failed:", err);
      toast.error("Tạo nhóm thất bại. Vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Tạo nhóm</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cover image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ảnh bìa nhóm
              </label>
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  {formData.coverImage ? (
                    <img
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera
                        size={48}
                        className="text-gray-400 mx-auto mb-2"
                      />
                      <p className="text-gray-500">Thêm ảnh bìa</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Group name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nhóm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="Chọn tên cho nhóm của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả nhóm (tùy chọn)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả về nhóm của bạn..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quyền riêng tư
              </label>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="PUBLIC"
                    checked={formData.privacy === "PUBLIC"}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Globe size={20} className="text-blue-600" />
                      <span className="font-medium text-gray-900">
                        Công khai
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và
                      những gì họ đăng.
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="privacy"
                    value="PRIVATE"
                    checked={formData.privacy === "PRIVATE"}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Lock size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-900">
                        Riêng tư
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những
                      gì họ đăng.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Invite friends */}
            <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="inviteFriends"
                name="inviteFriends"
                checked={formData.inviteFriends}
                onChange={handleInputChange}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor="inviteFriends"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Users size={20} className="text-green-600" />
                  <span className="font-medium text-gray-900">Mời bạn bè</span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Mời bạn bè tham gia nhóm ngay sau khi tạo.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!formData.groupName.trim() || isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
              >
                {isLoading ? "Đang tạo..." : "Tạo nhóm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
