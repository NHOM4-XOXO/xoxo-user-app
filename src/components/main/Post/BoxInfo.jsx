"use client";

import { useState } from "react";
import { Dropdown } from "antd";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import PrivacySelector from "@/components/common/PrivacySelector";

export default function BoxInfo({ icon, label, value, onEdit, onDelete, type }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [privacy, setPrivacy] = useState("public");

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const relationshipOptions = ["Độc thân", "Đang hẹn hò", "Đã kết hôn"];

    const handleEditClick = () => {
        setIsEditing(true);
        setInputValue(value);
        // setPrivacy(currentPrivacy);
    };

    const handleSave = () => {
        onEdit?.(inputValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setInputValue(value);
        setIsEditing(false);
    };

    const DropdownActions = (
        <Dropdown
            menu={{
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
            }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName={isDark ? "custom-dropdown" : ""}
        >
            <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-fb-dark-secondary transition cursor-pointer"
            >
                <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
        </Dropdown>
    );

    const renderInputField = () => {
        if (label === "Tình trạng") {
            return (
                <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-fb-dark-quaternary rounded-md bg-white dark:bg-fb-dark-primary text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {relationshipOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        }

        const inputType = ["Ngày sinh", "Ngày tham gia"].includes(label) ? "date" : "text";

        return (
            <input
                type={inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-fb-dark-quaternary rounded-md bg-white dark:bg-fb-dark-primary text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
        );
    };

    if (isEditing) {
        return (
            <div className="p-4 rounded-lg bg-fb-light-primary dark:bg-fb-dark-tertiary shadow-sm text-sm border border-gray-200 dark:border-fb-dark-quaternary space-y-3">
                <div>
                    <label className="block mb-1 font-semibold text-fb-dark-primary dark:text-white">
                        {label}
                    </label>
                    {renderInputField()}
                </div>
                <div className="flex justify-between items-center">
                    <PrivacySelector privacy={privacy} setPrivacy={setPrivacy} />

                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-fb-dark-quaternary text-gray-700 dark:text-white bg-gray-100 dark:bg-transparent hover:bg-gray-200 dark:hover:bg-fb-dark-secondary transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            Lưu
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg bg-fb-light-primary dark:bg-fb-dark-tertiary shadow-sm text-sm border border-gray-200 dark:border-fb-dark-quaternary">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-1">
                    {type === "overview" ? (
                        <>
                            <h3 className="font-semibold text-base text-fb-dark-primary dark:text-white">
                                {label}
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">
                                {value}
                            </p>
                        </>
                    ) : (
                        <div className="flex items-start flex-wrap gap-x-2 gap-y-1">
                            {icon && (
                                <span className="text-gray-500 dark:text-gray-300 flex items-center mt-[2px]">
                                    {icon}
                                </span>
                            )}
                            <span className="text-gray-500 dark:text-gray-300">{label}:</span>
                            <span className="font-medium dark:text-white break-words">{value}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <PrivacySelector privacy={privacy} setPrivacy={setPrivacy} />

                    {DropdownActions}
                </div>
            </div>
        </div>
    );
}