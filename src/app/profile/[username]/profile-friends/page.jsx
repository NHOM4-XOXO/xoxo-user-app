"use client";
import { useContext, useEffect, useState } from "react";
import { Search, MoreHorizontal, UserX, User, SquareX } from "lucide-react";
import { Dropdown, Menu } from "antd";
import { useTheme } from "next-themes";
import { useGetFriendsByIduserQuery, useGetFriendsQuery } from "@/features/friendshipApi";
import { ProfileContext } from "../layout";
import Link from "next/link";

const menu = {
    items: [
        {
            key: "view-profile",
            icon: <User size={18} />,
            label: <p className="font-semibold">Xem trang cá nhân</p>,
        },
        {
            key: "unfollow",
            icon: <SquareX size={18} />,
            label: <p className="font-semibold">Bỏ theo dõi</p>,
        },
        {
            key: "unfriend",
            icon: <UserX size={18} />,
            label: <p className="font-semibold">Hủy kết bạn</p>,
        },
    ],
};

const ProfileFriend = () => {
    const { profile, setIsLoading } = useContext(ProfileContext);
    const tabs = ["Tất cả bạn bè", "Đang theo dõi"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    // const [isDark, setIsDark] = useState(false);
    // const { theme, resolvedTheme } = useTheme();
    // useEffect(() => {
    //     // resolvedTheme sẽ là "dark" hoặc "light"
    //     setIsDark(resolvedTheme === "dark");
    // }, [resolvedTheme]);
    const { data: friends = [], isLoading: isLoadingFriends } = useGetFriendsByIduserQuery(profile?.id, { skip: !profile?.id });

    const handleMenuClick = (e, friend) => {
        if (e.key === "unfriend") {
            console.log(`Hủy kết bạn với ${friend.name}`);
        } else if (e.key === "hide") {
            console.log(`Ẩn ${friend.name} khỏi trang cá nhân`);
        }
    };

    return (
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary text-gray-800 dark:text-white flex flex-col p-4 space-y-3 shadow-sm dark:border-fb-dark-tertiary">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Bạn bè</h2>
                <div className="relative w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        className="w-full bg-fb-light-quaternary dark:bg-fb-dark-tertiary outline-none rounded-3xl pl-10 pr-3 py-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder="Tìm kiếm"
                    />
                </div>
            </div>

            {/* Tabs */}
            <ul className="flex gap-6 text-sm px-4 text-gray-600 dark:text-gray-300">
                {tabs.map((tab) => (
                    <li key={tab}>
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`relative transition-colors duration-200 py-2 px-3 rounded-sm ${activeTab === tab
                                ? "text-blue-600 dark:text-blue-400 font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:border-b-2 after:border-blue-600 dark:after:border-blue-400"
                                : "hover:bg-gray-200 dark:hover:bg-fb-dark-tertiary"
                                }`}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Friend List */}
            {isLoadingFriends ? (
                <div className="grid grid-cols-2 gap-4 px-4">
                    {(() => {
                        const skeletons = [];
                        for (let i = 0; i < 6; i++) {
                            skeletons.push(
                                <div
                                    key={i}
                                    className="flex gap-3 items-center bg-fb-light-primary dark:bg-fb-dark-tertiary 
              p-6 rounded-lg shadow-sm border border-gray-100 dark:border-fb-dark-tertiary animate-pulse"
                                >
                                    {/* Avatar fake */}
                                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-fb-dark-quaternary"></div>

                                    {/* Text fake */}
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-gray-300 dark:bg-fb-dark-quaternary rounded"></div>
                                        <div className="h-3 w-20 bg-gray-200 dark:bg-fb-dark-quaternary rounded"></div>
                                    </div>

                                    {/* Action button fake */}
                                    <div className="w-6 h-6 bg-gray-300 dark:bg-fb-dark-quaternary rounded-full"></div>
                                </div>
                            );
                        }
                        return skeletons;
                    })()}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                    {friends.map((friend) => (
                        <div
                            key={friend.id}
                            className="flex gap-3 items-center bg-fb-light-primary dark:bg-fb-dark-tertiary p-6 rounded-lg shadow-sm border border-gray-100 dark:border-fb-dark-tertiary"
                        >
                            <img
                                src={
                                    friend.avatarUrl ||
                                    "/default-avatar.jpg"
                                }
                                alt={friend.username}
                                className="w-16 h-16 rounded-full object-cover"
                            />

                            <div>
                                <h2 className="font-medium hover:underline cursor-pointer">
                                    <Link href={`/profile/${friend.username}`}>
                                        {friend.firstName} {friend.lastName}
                                    </Link>
                                </h2>
                                {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {friend.mutualFriends || 0} Bạn chung
                                    </p> */}
                            </div>

                            {activeTab === "Tất cả bạn bè" && (
                                <div className="ml-auto">
                                    <Dropdown
                                        menu={menu}
                                        placement="bottomRight"
                                        trigger={["click"]}
                                        arrow={{ pointAtCenter: true }}
                                    >
                                        <button type="button">
                                            <MoreHorizontal className="cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary w-8 h-8 p-[0.4rem] rounded-full" />
                                        </button>
                                    </Dropdown>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            )}

        </div>
    );
};

export default ProfileFriend;
