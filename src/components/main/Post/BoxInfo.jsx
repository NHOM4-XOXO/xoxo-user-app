"use client";

import { useEffect, useState } from "react";
import { Dropdown, Tooltip } from "antd";
import {
    Edit,
    Trash2,
    MoreHorizontal,
} from "lucide-react";
import PrivacySelector from "@/components/common/PrivacySelector";
import { useTheme } from "next-themes";



export default function BoxInfo({ icon, label, value, onEdit, onDelete, type }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const [isDark, setIsDark] = useState(false);
    const { theme, resolvedTheme } = useTheme();
    useEffect(() => {
        // resolvedTheme sẽ là "dark" hoặc "light"
        setIsDark(resolvedTheme === "dark");
    }, [resolvedTheme]);

    const handleEditClick = () => {
        setIsEditing(true);
        setInputValue(value);
    };

    const handleSave = () => {
        onEdit?.(inputValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setInputValue(value);
        setIsEditing(false);
    };

    const menu = {
        items: [
            {
                key: "edit",
                label: (
                    <span className="flex items-center gap-2 text-sm">
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                    </span>
                ),
                onClick: handleEditClick,
            },
            {
                key: "delete",
                label: (
                    <span className="flex items-center gap-2 text-sm text-red-500">
                        <Trash2 className="w-4 h-4" />
                        Xóa
                    </span>
                ),
                onClick: onDelete,
            },
        ],
    };

    const relationshipOptions = [
        "Độc thân",
        "Đang hẹn hò",
        "Đã kết hôn",
    ];

    const renderOverview = () => (
        <div>
            <div className="flex justify-between items-center">
                <h3 className="font-bold mb-2">{label}</h3>
                <div className="flex items-center gap-2">
                    <PrivacySelector />
                    <Dropdown menu={menu} trigger={["click"]} placement="bottomRight" overlayClassName={isDark ? "custom-dropdown" : ""}>
                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-fb-dark-secondary transition cursor-pointer"
                        >
                            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </Dropdown>
                </div>
            </div>
            <p>{value}</p>
        </div>
    );

    const renderNormal = () => (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-500 dark:text-gray-300">{icon}</span>
                <span className="text-gray-500 dark:text-gray-300">{label}:</span>
                <span className="font-semibold dark:text-white truncate">{value}</span>
            </div>
            <div className="flex items-center gap-2">
                <PrivacySelector />
                <Dropdown menu={menu} trigger={["click"]} placement="bottomRight" overlayClassName={isDark ? "custom-dropdown" : ""}>
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-fb-dark-secondary transition cursor-pointer"
                    >
                        <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                </Dropdown>
            </div>
        </div>
    );

    const renderInputField = () => {
        if (label === "Tình trạng") {
            return (
                <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-fb-dark-primary dark:text-white text-sm outline-blue-500"
                >
                    {relationshipOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        } else if (label === "Ngày sinh" || label === "Ngày tham gia") {
            return (
                <input
                    type="date"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-fb-dark-primary dark:text-white text-sm outline-blue-500"
                />
            );
        } else {
            return (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-fb-dark-primary dark:text-white text-sm outline-blue-500"
                />
            );
        }
    };

    if (isEditing) {
        return (
            <div className="p-4 rounded-lg bg-fb-light-primary dark:bg-fb-dark-tertiary shadow-sm text-sm border border-gray-200 dark:border-fb-dark-quaternary">
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-300 block mb-1">{label}</label>
                        {renderInputField()}
                    </div>
                    <div className="flex items-center justify-between">
                        <PrivacySelector />
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-fb-dark-secondary"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg bg-fb-light-primary dark:bg-fb-dark-tertiary shadow-sm text-sm border border-gray-200 dark:border-fb-dark-quaternary">
            {type === "overview" ? renderOverview() : renderNormal()}
        </div>
    );
}

