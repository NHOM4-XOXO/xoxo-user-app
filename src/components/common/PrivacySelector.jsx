"use client";

import { Dropdown, Tooltip } from "antd";
import { ChevronDown, Globe, Lock, UsersRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const privacyOptions = [
    { value: "public", label: "Công khai", icon: <Globe className="w-4 h-4" /> },
    { value: "friends", label: "Bạn bè", icon: <UsersRound className="w-4 h-4" /> },
    { value: "onlyMe", label: "Chỉ mình tôi", icon: <Lock className="w-4 h-4" /> },
];

const PrivacySelector = ({ privacy, setPrivacy }) => {
    const selectedIndex = privacyOptions.findIndex(opt => opt.value === privacy);
    const [isDark, setIsDark] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsDark(resolvedTheme === "dark");
    }, [resolvedTheme]);

    const privacyMenu = {
        items: privacyOptions.map((option) => ({
            key: option.value,
            label: (
                <div
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-white"
                    onClick={() => setPrivacy(option.value)}
                >
                    {option.icon}
                    {option.label}
                </div>
            ),
        })),
    };

    return (
        <Tooltip title={privacyOptions[selectedIndex]?.label}>
            <Dropdown
                menu={privacyMenu}
                trigger={["click"]}
                overlayClassName={isDark ? "custom-dropdown" : ""}
            >
                <button className="flex items-center space-x-2 bg-gray-100 dark:bg-fb-dark-quaternary px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-200">
                    {privacyOptions[selectedIndex]?.icon}
                    <ChevronDown className="w-3 h-3" />
                </button>
            </Dropdown>
        </Tooltip>
    );
};


export default PrivacySelector;
