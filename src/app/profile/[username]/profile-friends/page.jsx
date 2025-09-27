"use client";
import { useContext, useEffect, useState } from "react";
import { Search, MoreHorizontal, UserX, SquareX } from "lucide-react";
import { Dropdown } from "antd";
import { useGetFriendsByIduserQuery, useGetCountMutualFriendQuery } from "@/features/friendshipApi";
import { ProfileContext } from "../layout";
import Link from "next/link";

// Menu dropdown
const menu = {
    items: [
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

// Component con cho từng friend
const FriendCard = ({ friend, isMyProfile }) => {
    const { data: countMutualFriend, isLoading } = useGetCountMutualFriendQuery(friend.id);

    if (isLoading) {
        return (
            <div
                className="flex gap-3 items-center bg-fb-light-primary dark:bg-fb-dark-tertiary 
        p-6 rounded-lg shadow-sm border border-gray-100 dark:border-fb-dark-tertiary animate-pulse"
            >
                {/* Avatar fake */}
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-fb-dark-quaternary"></div>

                {/* Text fake */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 bg-gray-300 dark:bg-fb-dark-quaternary rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-fb-dark-quaternary rounded"></div>
                </div>

                {/* Action button fake */}
                {isMyProfile && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-fb-dark-quaternary rounded-full"></div>
                )}
            </div>
        );
    }

    return (
        <div
            key={friend.id}
            className="flex gap-3 items-center bg-fb-light-primary dark:bg-fb-dark-tertiary 
      p-6 rounded-lg shadow-sm border border-gray-100 dark:border-fb-dark-tertiary"
        >
            <img
                src={friend.avatarUrl || "/default-avatar.jpg"}
                alt={friend.username}
                className="w-16 h-16 rounded-full object-cover"
            />

            <div>
                <h2 className="font-medium hover:underline cursor-pointer">
                    <Link href={`/profile/${friend.username}`}>
                        {friend.firstName} {friend.lastName}
                    </Link>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {countMutualFriend || 0} bạn chung
                </p>
            </div>

            {/* Action */}
            <div className="ml-auto">
                {isMyProfile && (
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
                )}
            </div>
        </div>
    );
};


const ProfileFriend = () => {
    const { profile, setIsLoading } = useContext(ProfileContext);
    const tabs = ["Tất cả bạn bè"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [currentUser, setCurrentUser] = useState(null);

    const { data: friends = [], isLoading: isLoadingFriends } =
        useGetFriendsByIduserQuery(profile?.id, { skip: !profile?.id });

    const isMyProfile = currentUser?.id === profile?.id;

    useEffect(() => {
        setIsLoading(isLoadingFriends);
    }, [isLoadingFriends, setIsLoading]);

    useEffect(() => {
        try {
            const profile = JSON.parse(localStorage.getItem("profile"));
            setCurrentUser(profile || null);
        } catch (e) {
            console.error("Không đọc được auth:", e);
        }
    }, []);

    if (isLoadingFriends) return "";

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {friends.map((friend) => (
                    <FriendCard key={friend.id} friend={friend} isMyProfile={isMyProfile} />
                ))}
            </div>
        </div>
    );
};

export default ProfileFriend;
