"use client";

import {
    CalendarDays,
    Heart,
    Briefcase,
    MapPin,
    CalendarCheck,
    Mail,
    Plus,
    BadgeCheck,
    Cake,
    User,
    Phone,
    Home,
} from "lucide-react";
import BoxInfo from "@/components/main/Post/BoxInfo";
import { useState } from "react";

const initialInfoData = [
    {
        type: "overview",
        label: "Tổng quan",
        value:
            "Là người nhiệt huyết và thích khám phá, luôn sẵn sàng học hỏi điều mới. Yêu thích công nghệ và đam mê phát triển bản thân mỗi ngày.",
    },
    { icon: <CalendarDays className="w-4 h-4" />, label: "Ngày sinh", value: "1990-10-20" },
    { icon: <Heart className="w-4 h-4" />, label: "Tình trạng", value: "Độc thân" },
    { icon: <Briefcase className="w-4 h-4" />, label: "Chức vụ", value: "Lập trình viên" },
    { icon: <MapPin className="w-4 h-4" />, label: "Nơi ở", value: "Hồ Chí Minh" },
    { icon: <CalendarCheck className="w-4 h-4" />, label: "Ngày tham gia", value: "2019-11-26" },
    { icon: <Mail className="w-4 h-4" />, label: "Email", value: "abc@xyz.com" },
];

const possibleAdds = [
    {
        label: "Thêm nơi làm việc",
        targetLabel: "Nơi làm việc",
        icon: <Briefcase className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm học vấn",
        targetLabel: "Học vấn",
        icon: <CalendarCheck className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm nơi ở",
        targetLabel: "Nơi ở",
        icon: <MapPin className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm quê quán",
        targetLabel: "Quê quán",
        icon: <Home className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm email",
        targetLabel: "Email",
        icon: <Mail className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm số điện thoại",
        targetLabel: "Số điện thoại",
        icon: <Phone className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm tình trạng quan hệ",
        targetLabel: "Tình trạng",
        icon: <Heart className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm giới tính",
        targetLabel: "Giới tính",
        icon: <User className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm ngày sinh",
        targetLabel: "Ngày sinh",
        icon: <Cake className="w-4 h-4" />,
        defaultValue: "",
    },
    {
        label: "Thêm chức vụ",
        targetLabel: "Chức vụ",
        icon: <BadgeCheck className="w-4 h-4" />,
        defaultValue: "",
    },
];


export default function ProfileAbout() {
    const [infoList, setInfoList] = useState(initialInfoData);
    const missingFields = possibleAdds.filter(
        (add) => !infoList.some((item) => item.label === add.targetLabel)
    );

    const handleDelete = (label) => {
        setInfoList((prev) => prev.filter((item) => item.label !== label));
    };
    return (
        <section className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-5 shadow-sm dark:border dark:border-fb-dark-quaternary">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin cá nhân</h2>

            {/* Duyệt toàn bộ infoData */}
            {/* <div className="space-y-4">
                {infoList.map(({ type, label, value }, index) => {
                    if (type === "overview") {
                        return (
                            <BoxInfo key={index} label={label} type={type} value={value} />
                        )
                    }

                    return null; // sẽ xử lý phần còn lại ở grid bên dưới
                })}
            </div> */}

            {/* Thông tin cá nhân (ngoại trừ overview) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoList.map(({ icon, label, value, type }, index) => (
                    <div key={index} className={type === "overview" ? "md:col-span-2" : "h-full"}>
                        <BoxInfo
                            key={index}
                            icon={icon}
                            label={label}
                            value={value}
                            onDelete={() => handleDelete(label)}
                        />
                    </div>
                ))}
            </div>

            {/* Nút thêm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {missingFields.map(({ label, targetLabel, icon, defaultValue }, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setInfoList((prev) => [
                                ...prev,
                                {
                                    label: targetLabel,
                                    value: defaultValue,
                                    icon,
                                },
                            ]);
                        }}
                        className="group border-2 border-dashed border-gray-300 dark:border-fb-dark-quaternary p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-fb-dark-tertiary hover:text-blue-500 dark:hover:text-blue-400 transition text-center"
                    >
                        <div className="flex justify-center items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="font-medium">{label}</span>
                        </div>
                    </button>
                ))}

            </div>
        </section>
    );
}