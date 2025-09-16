"use client";

const genderMap = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
};

export default function BoxInfo({ icon, label, value, type }) {
    // Nếu là giới tính thì map lại
    const displayValue =
        label === "Giới tính" ? genderMap[value] || "Chưa có thông tin" : value || "Chưa có thông tin";

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
                                {displayValue}
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
                            <span className="font-medium dark:text-white break-words">
                                {displayValue}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
