"use client";
import Post from "@/components/main/Post/PostItem";
import PostCreation from "@/components/main/PostCreation";
import { useGetPostsByAuthorQuery } from "@/features/postApi";
import { useGetFriendsByIduserQuery } from "@/features/friendshipApi";
import { useGetUserByUsernameQuery } from "@/features/userApi";
import {
  CalendarDaysIcon,
} from "lucide-react";

import Link from "next/link";
import { useContext, useEffect } from 'react';
import { ProfileContext } from './layout';


const ProfilePost = () => {
  const { username, setIsLoading } = useContext(ProfileContext);
  const { data: profile = [], isLoading: isLoadingProfile } = useGetUserByUsernameQuery(username?.username);
  const { data: friends = [], isLoading: isLoadingFriends, } = useGetFriendsByIduserQuery(profile?.id, { skip: !profile?.id });
  const { data: posts = [], isLoading, } = useGetPostsByAuthorQuery(profile?.id, { skip: !profile?.id });

  useEffect(() => {
    setIsLoading(isLoading || isLoadingFriends || isLoadingProfile);
  }, [isLoading, isLoadingFriends, isLoadingProfile]);
  if (isLoading || isLoadingFriends || isLoadingProfile) {
    return null;
  }
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">

      <div className="w-full md:w-[60%] space-y-3">
        <PostCreation />

        {posts.map((item) => (
          <Post key={item?.post.id} data={item} />
        ))}
      </div>

      {/* Right Column */}
      <div className="w-full md:w-[40%] space-y-3 sticky top-4 self-start">
        {/* About */}
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 shadow-sm dark:border-fb-dark-quaternary text-sm text-gray-800 dark:text-white">
          <h1 className="font-bold mb-2 text-gray-900 dark:text-white">Giới thiệu</h1>

          <p className="mb-2 text-gray-700 dark:text-gray-300">
            {profile?.bio || "Chưa có giới thiệu."}
          </p>

          <p className="text-gray-500 dark:text-gray-400 mb-1 flex items-center">
            <CalendarDaysIcon className="w-4 h-4 mr-1" />
            Ngày sinh:
            <span className="text-gray-800 dark:text-gray-200 font-semibold ml-1">
              {profile?.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
                : "Không rõ"}
            </span>
          </p>
        </div>

        {/* Photos */}
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-4 shadow-sm  dark:border-fb-dark-quaternary">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Ảnh
            </h1>
            <Link
              href="/profile/profile-photos"
              className="text-sm text-blue-500 hover:underline"
            >
              Xem tất cả ảnh
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <img
                key={i}
                className="w-full h-28 object-cover rounded-lg hover:brightness-95 cursor-pointer transition duration-200"
                src={`https://picsum.photos/id/${110 + i}/200/200`}
                alt={`Ảnh ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Friends */}
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-4 shadow-sm  dark:border-fb-dark-quaternary">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Bạn bè
            </h1>
            <Link
              href="/profile/profile-friends"
              className="text-sm text-blue-500 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          {isLoadingFriends ? (
            <p>Đang tải bạn bè...</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {friends.slice(0, 6).map((friend) => (
                <div
                  key={friend.id}
                  className="text-sm text-center hover:brightness-95 cursor-pointer transition duration-200"
                >
                  <img
                    className="w-full h-26 object-cover rounded-lg border-1"
                    src={
                      friend.avatarUrl ||
                      "default-avatar.jpg"
                    }
                    alt={friend.username}
                  />
                  <p className="mt-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    <Link href={`/profile/${friend.username}`}>
                      {friend.firstName} {friend.lastName}
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;
