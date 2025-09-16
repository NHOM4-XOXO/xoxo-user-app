"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Post from "../main/Post/PostItem";
import PostCreation from "../main/PostCreation";
import ScrollableContainer from "../common/ScrollableContainer";
import { useGetAllGroupQuery, useGetGroupMembersQuery } from "@/features/groupManageMentApi";

export default function GroupDetailContent() {
  const [activeTab, setActiveTab] = useState("discussion");
  const params = useParams();
  const groupId = parseInt(params.id);

  const { data: groups, isLoading, isError } = useGetAllGroupQuery();
  const { data } = useGetGroupMembersQuery({ groupId });

  const members = data?.data?.members?.content || [];
  const totalMembers = data?.data?.members?.totalElements || 0;

  if (isLoading) return <p>Đang tải...</p>;
  if (isError || !groups) return <p>Lỗi tải nhóm</p>;

  // Tìm group theo id
  const group = groups.find((g) => g.id === groupId);

  if (!group) return <p>Không tìm thấy nhóm</p>;
  return (
    <div className="max-w-12xl mx-2">
      {/* Group Cover & Info */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div
          className="h-60 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${group?.coverUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-30"></div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {group?.name}
          </h1>
          <div className="flex items-center text-gray-600 mb-2">
            <span className="mr-4">
              {group?.privacy === "private" ? "🔒 Nhóm riêng tư" : "🌍 Công khai"}
            </span>
            <span>{group?.members} thành viên</span>
          </div>
          <p className="text-gray-700 mb-2">{group?.description}</p>
        </div>

        {/* Tabs */}
        <hr className="border-gray-300" />
        <nav className="flex">
          {["discussion", "members", "events", "photos", "files"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium border-b-2 ${activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab === "discussion"
                ? "Thảo luận"
                : tab === "members"
                  ? "Thành viên"
                  : tab === "events"
                    ? "Sự kiện"
                    : tab === "photos"
                      ? "Ảnh"
                      : "Tệp"}
            </button>
          ))}
        </nav>
      </div>

      {/* Discussion */}
      {activeTab === "discussion" && (
        <div className="flex gap-6">
          <div className="w-2/3 space-y-4">
            <div className="bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg mb-4 md:mb-6 border-gray-700">
              <PostCreation />
            </div>
            {/* {postsLoading ? (
              <div className="text-gray-600">Đang tải bài viết...</div>
            ) : (
              posts.map((item) => <Post key={item.id} data={item} />)
            )} */}
          </div>

          <div className="w-1/3 sticky top-4 self-start">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Giới thiệu</h3>
              <p className="text-gray-600 text-md mb-4">{group?.description}</p>
              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-md font-medium">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members */}
      {activeTab === "members" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Thành viên của nhóm ({totalMembers} thành viên)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.length === 0 ? (
              <p className="text-gray-500">Chưa có thành viên nào</p>
            ) : (
              members.map((m) => (
                <div
                  key={m.user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src={m.user.avatarUrl || "/default-avatar.png"}
                    alt={m.user.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {m.user.firstName} {m.user.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tham gia:{" "}
                      {new Date(m.membership.joinedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Nhắn tin
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Events */}
      {activeTab === "events" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sự kiện sắp tới</h3>
          <div className="space-y-4">
            {group?.events?.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                <p className="text-md text-gray-600 mb-2">
                  📅 {event.date} lúc {event.time}
                </p>
                <p className="text-gray-800">{event.description}</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-md hover:bg-blue-700">
                  Tham gia
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos */}
      {activeTab === "photos" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Ảnh của nhóm</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group?.photos?.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={`Photo ${index}`}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {activeTab === "files" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Tệp của nhóm</h3>
          <div className="space-y-3">
            {group?.files?.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  📄
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{file.name}</h4>
                  <p className="text-md text-gray-600">
                    {file.size} • {file.type}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-md">
                  Tải xuống
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ScrollableContainer />
    </div>
  );
}
