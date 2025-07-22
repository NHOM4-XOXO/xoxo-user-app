import {
    CalendarDays,
    Heart,
    Briefcase,
    MapPin,
    CalendarCheck,
    Mail,
    Globe,
    Pen,
    Plus,
} from "lucide-react";

const ProfileAbout = () => {
    const Box = ({ icon, label, value }) => (
        <div className="flex items-center justify-between  rounded-lg px-4 py-3 bg-fb-light-primary dark:bg-fb-dark-secondary shadow-sm text-sm border-gray-200 dark:border-fb-dark-quaternary">
            <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-300 text-base mr-3">
                    {icon}
                </span>
                <span className="text-gray-500 dark:text-gray-300">{label}:</span>
                <span className="font-semibold ml-1 dark:text-white">{value}</span>
            </div>
            <Globe className="w-4 h-4 text-gray-400 dark:text-gray-300 cursor-pointer hover:text-gray-600 dark:hover:text-white" />
        </div>
    );

    return (
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary flex flex-col p-4 space-y-2 shadow-sm  border-gray-200 dark:border-fb-dark-quaternary">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thông tin cá nhân
                </h2>
                <div className="hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary flex justify-center items-center w-12 h-12 rounded-full cursor-pointer transition-all duration-75">
                    <Pen className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
            </div>

            {/* TỔNG QUAN */}
            <div className="space-y-4">
                <div className="bg-fb-light-primary dark:bg-fb-dark-tertiary p-4 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-200 relative">
                    <h3 className="font-bold mb-2">Tổng quan</h3>
                    <p>
                        Là người nhiệt huyết và thích khám phá, luôn sẵn sàng học hỏi điều
                        mới. Yêu thích công nghệ và đam mê phát triển bản thân mỗi ngày.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Box icon={<CalendarDays className="w-4 h-4" />} label="Ngày sinh" value="20/10/1990" />
                    <Box icon={<Heart className="w-4 h-4" />} label="Tình trạng" value="Độc thân" />
                    <Box icon={<Briefcase className="w-4 h-4" />} label="Chức vụ" value="Lập trình viên chính" />
                    <Box icon={<MapPin className="w-4 h-4" />} label="Nơi ở" value="New Hampshire" />
                    <Box icon={<CalendarCheck className="w-4 h-4" />} label="Ngày tham gia" value="26/11/2019" />
                    <Box icon={<Mail className="w-4 h-4" />} label="Email" value="abc@xyz.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="border-2 border-dashed border-gray-300 dark:border-fb-dark-quaternary p-3 text-center rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        <Plus className="inline-block w-4 h-4 mr-2" />
                        Thêm nơi làm việc
                    </div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-fb-dark-quaternary p-3 text-center rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        <Plus className="inline-block w-4 h-4 mr-2" />
                        Thêm học vấn
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAbout;
