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
import {
    useGetFriendsByIduserQuery,
    useIsFriendQuery,
    useGetSentPendingQuery,
    useGetReceivedPendingQuery,
    useDeleteFriendMutation,
    useDeleteRequestMutation,
    useAcceptRequestMutation,
    useRejectRequestMutation,
    useSendRequestMutation,
} from "@/features/friendshipApi";
import Link from "next/link";

const tabs = [
    { label: "Bài viết", path: "/" },
    { label: "Giới thiệu", path: "profile-about" },
    { label: "Bạn bè", path: "profile-friends" },
];

const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);


function ProfileHeader({ userName, setIsLoading }) {
    const { data: profile = {}, isLoading, isFetching } =
        useGetUserByUsernameQuery(userName);
    const { data: friends = [], isLoading: isLoadingFriends } =
        useGetFriendsByIduserQuery(profile?.id, { skip: !profile?.id });

    const { data: relation, isLoading: isLoadingIsFriends } = useIsFriendQuery(profile?.id, {
        skip: !profile?.id,
    });
    const { data: sentPending } = useGetSentPendingQuery();
    const { data: receivedPending } = useGetReceivedPendingQuery();

    const [deleteFriend] = useDeleteFriendMutation();
    const [deleteRequest] = useDeleteRequestMutation();
    const [acceptRequest] = useAcceptRequestMutation();
    const [rejectRequest] = useRejectRequestMutation();
    const [sendRequest] = useSendRequestMutation();

    const [avatarLoading, setAvatarLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);

    const [localRelation, setLocalRelation] = useState({
        isFriend: false,
        isSentPending: false,
        isReceivedPending: false,
    });

    useEffect(() => {
        if (relation || sentPending || receivedPending) {
            setLocalRelation({
                isFriend: relation?.areFriends,
                isSentPending: !!sentPending?.find(
                    (item) => item.friend.id === profile.id && item.status === "PENDING"
                ),
                isReceivedPending: !!receivedPending?.find(
                    (item) => item.user.id === profile.id && item.status === "PENDING"
                ),
            });
        }
    }, [relation, sentPending, receivedPending, profile?.id]);


    useEffect(() => {
        const stored = localStorage.getItem("profile");
        if (stored) {
            setCurrentUser(JSON.parse(stored));
        }
    }, []);

    const isMe = currentUser?.username === profile?.username;

    const isFriend = relation?.areFriends;
    const isSentPending = sentPending?.find(
        (item) => item.friend.id === profile.id && item.status === "PENDING"
    );
    const isReceivedPending = receivedPending?.find(
        (item) => item.user.id === profile.id && item.status === "PENDING"
    );

    // ===== Avatar & Cover update =====
    const [updateAvatar] = useUpdateAvatarMutation();
    const [updateCover] = useUpdateCoverMutation();

    // ===== Handlers =====
    const handleSendRequest = async (userId) => {
        setLoadingAction("sendRequest");
        try {
            await sendRequest(userId).unwrap();
            toast.success("Đã gửi lời mời kết bạn");
            setLocalRelation({ isFriend: false, isSentPending: true, isReceivedPending: false });
        } catch {
            toast.error("Gửi lời mời thất bại");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDeleteRequest = async (requestId) => {
        setLoadingAction("deleteRequest");
        try {
            await deleteRequest(requestId).unwrap();
            toast.success("Đã hủy lời mời");
            setLocalRelation({ isFriend: false, isSentPending: false, isReceivedPending: false });
        } catch {
            toast.error("Hủy lời mời thất bại");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        setLoadingAction("acceptRequest");
        try {
            await acceptRequest(requestId).unwrap();
            toast.success("Đã chấp nhận lời mời");
            setLocalRelation({ isFriend: true, isSentPending: false, isReceivedPending: false });
        } catch {
            toast.error("Chấp nhận thất bại");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleRejectRequest = async (requestId) => {
        setLoadingAction("rejectRequest");
        try {
            await rejectRequest(requestId).unwrap();
            toast.success("Đã xóa lời mời");
            setLocalRelation({ isFriend: false, isSentPending: false, isReceivedPending: false });
        } catch {
            toast.error("Xóa thất bại");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDeleteFriend = async (friendshipId) => {
        setLoadingAction("deleteFriend");
        try {
            await deleteFriend(friendshipId).unwrap();
            toast.success("Đã hủy kết bạn");
            setLocalRelation({ isFriend: false, isSentPending: false, isReceivedPending: false });
        } catch {
            toast.error("Hủy kết bạn thất bại");
        } finally {
            setLoadingAction(null);
        }
    };



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
        } catch {
            toast.error("Cập nhật cover thất bại!", { id: toastId });
        } finally {
            setCoverLoading(false);
        }
    };

    const avatar =
        profile?.avatarUrl || "https://placehold.co/150x150?text=No+Avatar";
    const cover =
        profile?.coverUrl || "https://placehold.co/1000x300?text=No+Cover";
    const displayName =
        `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
        profile?.username ||
        "Người dùng";

    if (isFetching || isLoadingIsFriends || avatarLoading || coverLoading) return null;

    return (
        <div className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary shadow-sm">
            {/* Cover */}
            <div className="relative group">
                <img
                    className="w-full rounded-t-lg object-cover h-[20rem]"
                    src={cover}
                    alt="cover"
                />
                {isMe && (
                    <>
                        <label
                            htmlFor="coverUpload"
                            className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full cursor-pointer hover:bg-black/70 transition"
                        >
                            <Camera className="w-4 h-4" />
                        </label>
                        <input
                            type="file"
                            id="coverUpload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                        />
                    </>
                )}
            </div>

            {/* Avatar + Info */}
            <div className="flex flex-col justify-start items-start sm:flex-row px-3 h-auto pb-6 relative border-b border-gray-200 dark:border-fb-dark-quaternary">
                <div className="w-[10rem] sm:-mt-12 -mt-16 sm:mb-0 relative">
                    <img
                        className="w-[9rem] h-[9rem] mx-auto rounded-full border-4 border-fb-light-primary dark:border-fb-dark-secondary object-cover"
                        src={avatar}
                        alt="avatar"
                    />
                    {isMe && (
                        <>
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
                        </>
                    )}
                </div>
                <div className="sm:ml-4 text-center sm:text-left sm:mt-4 text-black dark:text-white">
                    <h1 className="font-bold text-lg">{displayName}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm hover:underline cursor-pointer">
                        {friends.length} Bạn bè
                    </p>
                </div>

                {/* Button tình trạng bạn bè */}
                {!isMe && (
                    <div className="sm:ml-auto sm:mt-4 mt-2 text-end flex gap-2">
                        {localRelation.isFriend ? (
                            <button
                                onClick={() => handleDeleteFriend(relation.friendshipId)}
                                disabled={loadingAction === "deleteFriend"}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm"
                            >
                                {loadingAction === "deleteFriend" ? <LoadingSpinner /> : "Hủy kết bạn"}
                            </button>
                        ) : localRelation.isSentPending ? (
                            <button
                                onClick={() => handleDeleteRequest(isSentPending.id)}
                                disabled={loadingAction === "deleteRequest"}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm"
                            >
                                {loadingAction === "deleteRequest" ? <LoadingSpinner /> : "Hủy lời mời"}
                            </button>
                        ) : localRelation.isReceivedPending ? (
                            <>
                                <button
                                    onClick={() => handleAcceptRequest(isReceivedPending.id)}
                                    disabled={loadingAction === "acceptRequest"}
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm"
                                >
                                    {loadingAction === "acceptRequest" ? <LoadingSpinner /> : "Xác nhận"}
                                </button>
                                <button
                                    onClick={() => handleRejectRequest(isReceivedPending.id)}
                                    disabled={loadingAction === "rejectRequest"}
                                    className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-60 text-black px-3 py-2 rounded-lg text-sm"
                                >
                                    {loadingAction === "rejectRequest" ? <LoadingSpinner /> : "Xóa"}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => handleSendRequest(profile.id)}
                                disabled={loadingAction === "sendRequest"}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm"
                            >
                                {loadingAction === "sendRequest" ? <LoadingSpinner /> : "Thêm bạn bè"}
                            </button>
                        )}
                    </div>
                )}

            </div>

            {/* Tabs */}
            <div className="px-4">
                <ProfileTabs userName={userName} tabs={tabs} />
            </div>
        </div>
    );
}

export default ProfileHeader;
