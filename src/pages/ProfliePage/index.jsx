"use client";
import { useState } from "react";

import { User } from "lucide-react";
import ProfilePost from "@/components/Profile-tabs/ProfilePost";
import ProfileAbout from "@/components/Profile-tabs/ProfileAbout";
import ProfileFriend from "@/components/Profile-tabs/ProfileFriend";
import ProfileImage from "@/components/Profile-tabs/ProfileImage";


export default function Profile() {
    const tabs = ["Bài viết", "Giới thiệu", "Bạn bè", "Ảnh", "Video"];
    const [activeTab, setActiveTab] = useState("Bài viết");

    return (
        <div className="profile bg-fb-light-secondary dark:bg-fb-dark-primary min-h-screen pb-10">
            <div className="w-full mt-8 px-4 md:px-4">
                <div className="w-full max-w-[1000px] mx-auto space-y-4">
                    <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary shadow-sm border border-fb-light-tertiary dark:border-fb-dark-quaternary">
                        {/* Cover */}
                        <div>
                            <img
                                className="w-full rounded-t-lg object-cover h-[20rem]"
                                src="https://picsum.photos/id/1015/1000/300"
                                alt="cover"
                            />
                        </div>

                        {/* Avatar + Info */}
                        <div className="flex flex-col justify-center items-center sm:flex-row px-3 h-auto pb-6 relative border-b border-fb-light-tertiary dark:border-fb-dark-quaternary">
                            <div className="w-[10rem] sm:-mt-12 -mt-16 sm:mb-0">
                                <img
                                    className="rounded-full w-[80%] md:w-[90%] mx-auto border-4 border-fb-light-primary dark:border-fb-dark-secondary"
                                    src="https://randomuser.me/api/portraits/men/75.jpg"
                                    alt="avatar"
                                />
                            </div>
                            <div className="sm:ml-4 text-center sm:text-left sm:mt-4 text-black dark:text-white">
                                <h1 className="font-bold text-lg">Nguyễn Thành Tài</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm hover:underline cursor-pointer">
                                    300 Bạn bè
                                </p>
                            </div>
                            <div className="sm:ml-auto sm:mt-4 mt-2 text-end">
                                <button className="bg-fb-light-tertiary dark:bg-fb-dark-tertiary px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary transition-colors duration-200 flex items-center text-black dark:text-white">
                                    <User className="w-4 h-4 mr-1" />
                                    Chỉnh sửa trang cá nhân
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-4">
                            <ul className="flex flex-wrap gap-6 text-sm p-3 text-gray-700 dark:text-gray-300 justify-center">
                                {tabs.map((item, i) => (
                                    <li key={i}>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveTab(item);
                                            }}
                                            className={`relative transition-colors duration-200 py-2 px-3 rounded-sm ${activeTab === item
                                                ? "text-blue-600 dark:text-blue-400 font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:border-b-2 after:border-blue-600 dark:after:border-blue-400"
                                                : "hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary"
                                                }`}
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="main-content text-black dark:text-white">
                        {activeTab === "Bài viết" && <ProfilePost />}
                        {activeTab === "Giới thiệu" && <ProfileAbout />}
                        {activeTab === "Bạn bè" && <ProfileFriend />}
                        {activeTab === "Ảnh" && <ProfileImage />}
                    </div>
                </div>
            </div>
        </div>
    );
}
