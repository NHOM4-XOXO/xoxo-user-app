import { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";

const friends = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        mutualFriends: 5,
    },
    {
        id: 2,
        name: "Trần Thị B",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        mutualFriends: 3,
    },
    {
        id: 3,
        name: "Lê Văn C",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg",
        mutualFriends: 8,
    },
    {
        id: 4,
        name: "Phạm Thị D",
        avatar: "https://randomuser.me/api/portraits/women/36.jpg",
        mutualFriends: 2,
    },
    {
        id: 5,
        name: "Hoàng Văn E",
        avatar: "https://randomuser.me/api/portraits/men/66.jpg",
        mutualFriends: 6,
    },
    {
        id: 6,
        name: "Đinh Thị F",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        mutualFriends: 4,
    },
];

const ProfileFriend = () => {
    const tabs = ["Tất cả bạn bè", "Đang theo dõi"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-primary text-gray-800 dark:text-white flex flex-col p-4 space-y-3 shadow-sm border border-gray-200 dark:border-fb-dark-tertiary">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Bạn bè</h2>
                <div className="relative w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        className="w-full bg-fb-light-tertiary dark:bg-fb-dark-secondary outline-none rounded-3xl pl-10 pr-3 py-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                    <div
                        key={friend.id}
                        className="flex gap-3 items-center bg-fb-light-secondary dark:bg-fb-dark-secondary p-6 rounded-lg shadow-sm border border-gray-100 dark:border-fb-dark-tertiary"
                    >
                        <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="font-medium">{friend.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {friend.mutualFriends} Bạn chung
                            </p>
                        </div>
                        {activeTab === "Tất cả bạn bè" && (
                            <MoreHorizontal className="ml-auto text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-fb-dark-tertiary p-2 rounded-full" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileFriend;
