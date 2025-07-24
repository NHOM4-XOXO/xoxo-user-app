"use client";

import {
    CalendarDays,
    Heart,
    Briefcase,
    MapPin,
    CalendarCheck,
    Mail,
    Plus,
} from "lucide-react";
import BoxInfo from "@/components/main/Post/BoxInfo";

const infoData = [
    {
        type: "overview",
        label: "Tổng quan",
        value:
            "Là người nhiệt huyết và thích khám phá, luôn sẵn sàng học hỏi điều mới. Yêu thích công nghệ và đam mê phát triển bản thân mỗi ngày.",
    },
    { icon: <CalendarDays className="w-4 h-4" />, label: "Ngày sinh", value: "20/10/1990" },
    { icon: <Heart className="w-4 h-4" />, label: "Tình trạng", value: "Độc thân" },
    { icon: <Briefcase className="w-4 h-4" />, label: "Chức vụ", value: "Lập trình viên" },
    { icon: <MapPin className="w-4 h-4" />, label: "Nơi ở", value: "Hồ Chí Minh" },
    { icon: <CalendarCheck className="w-4 h-4" />, label: "Ngày tham gia", value: "26/11/2019" },
    { icon: <Mail className="w-4 h-4" />, label: "Email", value: "abc@xyz.com" },
];

const addActions = [
    { label: "Thêm nơi làm việc" },
    { label: "Thêm học vấn" },
];

export default function ProfileAbout() {
    return (
        <section className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-5 shadow-sm dark:border dark:border-fb-dark-quaternary">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin cá nhân</h2>

            {/* Duyệt toàn bộ infoData */}
            <div className="space-y-4">
                {infoData.map(({ type, label, value }, index) => {
                    if (type === "overview") {
                        return (
                            <BoxInfo key={index} label={label} type={type} value={value} />
                        )
                    }

                    return null; // sẽ xử lý phần còn lại ở grid bên dưới
                })}
            </div>

            {/* Thông tin cá nhân (ngoại trừ overview) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoData
                    .filter(({ type }) => type !== "overview")
                    .map(({ icon, label, value }, index) => (
                        <div key={index} className="h-full">
                            <BoxInfo icon={icon} label={label} value={value} />
                        </div>
                    ))}
            </div>

            {/* Nút thêm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {addActions.map(({ label }, index) => (
                    <button
                        key={index}
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
