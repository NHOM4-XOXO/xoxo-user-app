
import {
    ImageIcon,
    VideoIcon,
    FlagIcon,
    CalendarDaysIcon,
    HeartIcon,
} from "lucide-react";
import Post from "../Post/PostItem";
import PostCreation from "../main/PostCreation";


const posts = [
    {
        id: 1,
        name: "Nguyễn Thành Tài",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        time: "07 tháng 7, 2025",
        caption:
            "Đây là buổi sáng tuyệt vời để bắt đầu hành trình mới. Cùng cố gắng nhé mọi người!...",
        image: "https://picsum.photos/id/1015/800/400",
        likes: 24,
        comments: 5,
    },
    {
        id: 2,
        name: "Trần Thị Hạnh",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        time: "03 tháng 7, 2025",
        caption: "Mỗi bức ảnh là một kỷ niệm. Du lịch Đà Lạt thật tuyệt vời!",
        image: "https://picsum.photos/id/1035/800/400",
        likes: 40,
        comments: 12,
    },
    {
        id: 3,
        name: "Lê Minh Khôi",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        time: "01 tháng 7, 2025",
        caption:
            "Hôm nay trời đẹp quá, tranh thủ ra ngoài cafe làm việc một chút 😎",
        image: "https://picsum.photos/id/1043/800/400",
        likes: 18,
        comments: 4,
    },
];

const ProfilePost = () => {
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Left Column */}
            <div className="w-full md:w-[60%] space-y-3">

                <PostCreation />

                {posts.map((item, index) => (
                    <Post key={index} data={item} />
                ))}
            </div>

            {/* Right Column */}
            <div className="w-full md:w-[40%] space-y-3">
                {/* About */}
                <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 shadow-sm border border-gray-200 dark:border-fb-dark-quaternary text-sm text-gray-800 dark:text-white">
                    <h1 className="font-bold mb-2 text-gray-900 dark:text-white">
                        Giới thiệu
                    </h1>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                        excepturi fugit placeat veniam voluptate neque.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        Ngày sinh:
                        <span className="text-gray-800 dark:text-gray-200 font-semibold ml-1">
                            01/06/2004
                        </span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center">
                        <HeartIcon className="w-4 h-4 mr-1" />
                        Tình trạng:
                        <span className="text-gray-800 dark:text-gray-200 font-semibold ml-1">
                            Độc thân
                        </span>
                    </p>
                </div>

                {/* Photos */}
                <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-4 shadow-sm border border-gray-200 dark:border-fb-dark-quaternary">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Ảnh
                        </h1>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                            Xem tất cả ảnh
                        </a>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                            <img
                                key={i}
                                className="w-full h-28 object-cover rounded-lg hover:brightness-95 cursor-pointer transition duration-200"
                                src={`https://picsum.photos/id/${110 + i}/200/200`}
                                alt={`Ảnh ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Friends */}
                <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-4 shadow-sm border border-gray-200 dark:border-fb-dark-quaternary">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Bạn bè
                        </h1>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                            Xem tất cả
                        </a>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="text-sm text-center hover:brightness-95 cursor-pointer transition duration-200"
                            >
                                <img
                                    className="w-full h-28 object-cover rounded-lg"
                                    src={`https://randomuser.me/api/portraits/lego/${i}.jpg`}
                                    alt="Tên bạn bè"
                                />
                                <p className="mt-1 font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                                    Tên bạn bè
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePost;
