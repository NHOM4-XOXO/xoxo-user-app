import { useState } from "react";

const ProfileImage = () => {
    const tabs = ["Ảnh của bạn", "Album"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-primary flex flex-col p-4 space-y-4 shadow-sm border border-gray-200 dark:border-fb-dark-tertiary text-gray-800 dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ảnh</h2>
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

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-4">
                {[...Array(20)].map((_, i) => (
                    <img
                        key={i}
                        className="w-full h-auto object-cover rounded-lg hover:brightness-95 cursor-pointer transition duration-200"
                        src={`https://picsum.photos/id/${110 + i}/200/200`}
                        alt={`Ảnh ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileImage;
