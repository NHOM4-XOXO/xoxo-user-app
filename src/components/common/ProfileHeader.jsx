"use client";
import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import ProfileTabs from "@/components/common/ProfileTabs";
import {
    useGetUserByUsernameQuery,
    useUpdateAvatarMutation,
    useUpdateCoverMutation,
} from "@/features/userApi";

const tabs = [
    { label: "Bài viết", path: "/" },
    { label: "Giới thiệu", path: "profile-about" },
    { label: "Bạn bè", path: "profile-friends" },
    { label: "Ảnh", path: "profile-photos" },
    { label: "Video", path: "profile-videos" },
];

function ProfileHeader({ userName, setIsLoading }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: profile = [], isLoading, isFetching } = useGetUserByUsernameQuery(userName);


    const [updateAvatar] = useUpdateAvatarMutation();
    const [updateCover] = useUpdateCoverMutation();

    const [avatarLoading, setAvatarLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);

    // Kích hoạt loading layout khi fetching / avatar / cover đang update
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // lần đầu thì bỏ qua
            return;
        }

        setIsLoading && setIsLoading(isFetching || avatarLoading || coverLoading);
    }, [isFetching || avatarLoading, coverLoading]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const toastId = toast.loading("Đang cập nhật avatar...");

        try {
            setAvatarLoading(true);
            await updateAvatar(formData).unwrap();
            toast.success("Cập nhật avatar thành công!", { id: toastId });
            refetch();
        } catch {
            toast.error("Cập nhật avatar thất bại!", { id: toastId });
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const toastId = toast.loading("Đang cập nhật cover...");

        try {
            setCoverLoading(true);
            await updateCover(formData).unwrap();
            toast.success("Cập nhật cover thành công!", { id: toastId });
            refetch();
        } catch {
            toast.error("Cập nhật cover thất bại!", { id: toastId });
        } finally {
            setCoverLoading(false);
        }
    };

    const avatar = profile?.avatarUrl || "https://placehold.co/150x150?text=No+Avatar";
    const cover = profile?.coverUrl || "https://placehold.co/1000x300?text=No+Cover";
    const displayName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || profile?.username || "Người dùng";

    if (isFetching || avatarLoading || coverLoading) {
        return null;
    }

    return (
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary shadow-sm border-fb-light-tertiary dark:border-fb-dark-quaternary">
            {/* Cover */}
            <div className="relative group">
                <img className="w-full rounded-t-lg object-cover h-[20rem]" src={cover} alt="cover" />
                <label htmlFor="coverUpload" className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full cursor-pointer hover:bg-black/70 transition">
                    <Camera className="w-4 h-4" />
                </label>
                <input type="file" id="coverUpload" accept="image/*" className="hidden" onChange={handleCoverChange} />
            </div>

            {/* Avatar + Info */}
            <div className="flex flex-col justify-center items-center sm:flex-row px-3 h-auto pb-6 relative border-b border-fb-light-tertiary dark:border-fb-dark-quaternary">
                <div className="w-[10rem] sm:-mt-12 -mt-16 sm:mb-0 relative">
                    <img
                        className="w-[9rem] h-[9rem] mx-auto rounded-full border-4 border-fb-light-primary dark:border-fb-dark-secondary object-cover"
                        src={avatar}
                        alt="avatar"
                    />
                    {/* Input file giả dạng button */}
                    <label
                        htmlFor="avatarUpload"
                        className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full cursor-pointer hover:bg-black/70 transition"
                    >
                        <Camera className="w-4 h-4" />
                    </label>
                    <input
                        type="file"
                        id="avatarUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>
                <div className="sm:ml-4 text-center sm:text-left sm:mt-4 text-black dark:text-white">
                    <h1 className="font-bold text-lg">{`${displayName}`}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm hover:underline cursor-pointer">
                        300 Bạn bè
                    </p>
                </div>
                <div className="sm:ml-auto sm:mt-4 mt-2 text-end">
                    {/* <button
                        className="bg-fb-light-tertiary dark:bg-fb-dark-tertiary px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-fb-dark-quaternary transition-colors duration-200 flex items-center text-black dark:text-white"
                    // onClick={showModal}
                    >
                        <User className="w-4 h-4 mr-1" />
                        Chỉnh sửa trang cá nhân
                    </button> */}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4">
                <ProfileTabs userName={userName} tabs={tabs} />
            </div>

            {/* Modal chỉnh sửa */}
            <Modal
                title={<h2 className="text-xl font-bold text-center mb-3 text-fb-light-primary dark:text-white">Chỉnh sửa trang cá nhân</h2>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={700}
                centered
                className="custom-dark-modal"
            >
                <form className="space-y-6 p-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tên hiển thị
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 dark:border-fb-dark-tertiary bg-white dark:bg-fb-dark-primary p-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue={displayName}
                            placeholder="Nhập tên bạn muốn hiển thị"
                        />
                    </div>

                    <div className="text-end pt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default ProfileHeader;
