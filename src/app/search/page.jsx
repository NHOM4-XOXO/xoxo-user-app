"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiUsers,
  FiFileText,
  FiUsers as FiGroups,
} from "react-icons/fi";
import { searchUsers, searchPosts, searchGroups } from "@/features/searchApi";
import { RootContext } from "../ClientProviders";

export default function SearchPage() {
  const { setIsLoading } = useContext(RootContext);
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
    groups: [],
    totalUsers: 0,
    totalPosts: 0,
    totalGroups: 0,
    totalResults: 0,
  });

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  const handleSearch = async (searchKeyword = keyword) => {
    if (!searchKeyword.trim()) return;

    setLoading(true);
    try {
      const results = await searchUsers({
        keyword: searchKeyword,
        page: 0,
        size: 20,
      });
      if (results.data) {
        setSearchResults(results.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy keyword từ URL params và tự động search khi URL thay đổi
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q !== keyword) {
      setKeyword(q);
      handleSearch(q);
    }
  }, [searchParams, keyword]); // Listen to searchParams changes

  const tabs = [
    {
      id: "all",
      label: "Tất cả",
      icon: <FiSearch />,
      count: searchResults.totalResults,
    },
    {
      id: "users",
      label: "Mọi người",
      icon: <FiUsers />,
      count: searchResults.totalUsers,
    },
    {
      id: "posts",
      label: "Bài viết",
      icon: <FiFileText />,
      count: searchResults.totalPosts,
    },
    {
      id: "groups",
      label: "Nhóm",
      icon: <FiGroups />,
      count: searchResults.totalGroups,
    },
  ];

  const renderUserCard = (user) => (
    <div
      key={user.id}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <img
          src={user.avatarUrl || "/default-avatar.jpg"}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
          Kết bạn
        </button>
      </div>
    </div>
  );

  const renderPostCard = (post) => (
    <div
      key={post.id}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <img
          src={post.authorAvatarUrl || "/default-avatar.jpg"}
          alt={post.authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {post.authorName}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {post.content}
          </p>
          {post.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              📍 {post.location}
            </p>
          )}
          {post.hashtags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.hashtags.split(",").map((tag, index) => (
                <span key={index} className="text-blue-500 text-sm">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>👍 {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
            <span>🔄 {post.shareCount}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroupCard = (group) => (
    <div
      key={group.id}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        <img
          src={group.coverUrl || "/default-avatar.jpg"}
          alt={group.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {group.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {group.privacy} • {group.memberCount} thành viên
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {group.description}
          </p>
          {group.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              📍 {group.location}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Được tạo bởi {group.creatorName}
          </p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors self-start">
          Tham gia
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const { users, posts, groups } = searchResults;

    if (activeTab === "all") {
      return (
        <div className="space-y-6">
          {users.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Mọi người
              </h3>
              <div className="grid gap-4">
                {users.slice(0, 3).map(renderUserCard)}
              </div>
              {users.length > 3 && (
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Xem tất cả {users.length} người
                </button>
              )}
            </section>
          )}

          {posts.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Bài viết
              </h3>
              <div className="grid gap-4">
                {posts.slice(0, 3).map(renderPostCard)}
              </div>
              {posts.length > 3 && (
                <button
                  onClick={() => setActiveTab("posts")}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Xem tất cả {posts.length} bài viết
                </button>
              )}
            </section>
          )}

          {groups.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Nhóm
              </h3>
              <div className="grid gap-4">
                {groups.slice(0, 3).map(renderGroupCard)}
              </div>
              {groups.length > 3 && (
                <button
                  onClick={() => setActiveTab("groups")}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Xem tất cả {groups.length} nhóm
                </button>
              )}
            </section>
          )}
        </div>
      );
    }

    if (activeTab === "users" && users.length > 0) {
      return <div className="grid gap-4">{users.map(renderUserCard)}</div>;
    }

    if (activeTab === "posts" && posts.length > 0) {
      return <div className="grid gap-4">{posts.map(renderPostCard)}</div>;
    }

    if (activeTab === "groups" && groups.length > 0) {
      return <div className="grid gap-4">{groups.map(renderGroupCard)}</div>;
    }

    return (
      <div className="text-center py-12">
        <FiSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không tìm thấy kết quả
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Thử tìm kiếm với từ khóa khác
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto pt-6 pb-12 px-4">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg mb-6 shadow-sm">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          {renderResults()}
        </div>
      </div>
    </div>
  );
}
