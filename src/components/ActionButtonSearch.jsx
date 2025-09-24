import {
    useAcceptRequestMutation,
    useDeleteFriendMutation,
    useDeleteRequestMutation,
    useSendRequestMutation,
} from "@/features/friendshipApi";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ActionButton = ({ user, isMe, isFriend, isSentPending, isReceivedPending }) => {
    const [sendRequest] = useSendRequestMutation();
    const [acceptRequest] = useAcceptRequestMutation();
    const [deleteRequest] = useDeleteRequestMutation();
    const [deleteFriend] = useDeleteFriendMutation();

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState(() => {
        if (isFriend) return "friend";
        if (isSentPending) return "sent";
        if (isReceivedPending) return "received";
        return "none";
    });

    if (isMe) return null;

    let buttonProps = {};

    if (status === "friend") {
        buttonProps = {
            text: "Hủy kết bạn",
            color: "bg-red-500 text-white hover:bg-red-600",
            onClick: async () => {
                try {
                    setLoading(true);
                    await deleteFriend(isFriend).unwrap();
                    setStatus("none");
                    toast.success("Hủy kết bạn thành công!");
                } catch (err) {
                    toast.error("Hủy kết bạn thất bại!");
                } finally {
                    setLoading(false);
                }
            },
        };
    } else if (status === "sent") {
        buttonProps = {
            text: "Hủy lời mời",
            color: "bg-red-500 text-white hover:bg-red-600",
            onClick: async () => {
                try {
                    setLoading(true);
                    await deleteRequest(isSentPending.id).unwrap();
                    setStatus("none");
                    toast.success("Hủy lời mời thành công!");
                } catch (err) {
                    toast.error("Hủy lời mời thất bại!");
                } finally {
                    setLoading(false);
                }
            },
        };
    } else if (status === "received") {
        buttonProps = {
            text: "Xác nhận lời mời",
            color: "bg-green-500 text-white hover:bg-green-600",
            onClick: async () => {
                try {
                    setLoading(true);
                    await acceptRequest(isReceivedPending.id).unwrap();
                    setStatus("friend");
                    toast.success("Xác nhận lời mời thành công!");
                } catch (err) {
                    toast.error("Xác nhận lời mời thất bại!");
                } finally {
                    setLoading(false);
                }
            },
        };
    } else {
        buttonProps = {
            text: "Kết bạn",
            color: "bg-blue-500 text-white hover:bg-blue-600",
            onClick: async () => {
                try {
                    setLoading(true);
                    await sendRequest(user.id).unwrap();
                    setStatus("sent");
                    toast.success("Gửi lời mời thành công!");
                } catch (err) {
                    toast.error("Gửi lời mời thất bại!");
                } finally {
                    setLoading(false);
                }
            },
        };
    }

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                buttonProps.onClick();
            }}
            disabled={loading}
            className={`${buttonProps.color} transition-colors duration-200 rounded-md px-4 py-2 shadow-sm flex items-center justify-center min-w-[110px]`}
        >
            {loading ? (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            ) : (
                buttonProps.text
            )}
        </button>
    );
};

export default ActionButton;
