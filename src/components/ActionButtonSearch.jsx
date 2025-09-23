import { useAcceptRequestMutation, useDeleteFriendMutation, useDeleteRequestMutation, useSendRequestMutation } from "@/features/friendshipApi";
import React from "react";
import toast from "react-hot-toast";


const ActionButton = ({ user, isMe, isFriend, isSentPending, isReceivedPending }) => {
    const [sendRequest] = useSendRequestMutation();
    const [acceptRequest] = useAcceptRequestMutation();
    const [deleteRequest] = useDeleteRequestMutation();
    const [deleteFriend] = useDeleteFriendMutation();

    if (isMe) return null;

    let buttonProps = {};

    if (isFriend) {
        buttonProps = {
            text: "Hủy kết bạn",
            color: "bg-red-500 text-white hover:bg-red-600",
            onClick: async () => {
                try {
                    await deleteFriend(isFriend).unwrap();
                    toast.success("Hủy kết bạn thành công!");
                } catch (err) {
                    toast.error("Hủy kết bạn thất bại!");
                }
            },
        };
    } else if (isSentPending) {
        buttonProps = {
            text: "Hủy lời mời",
            color: "bg-red-500 text-white hover:bg-red-600",
            onClick: async () => {
                try {
                    await deleteRequest(isSentPending.id).unwrap();
                    toast.success("Hủy lời mời thành công!");
                } catch (err) {
                    toast.error("Hủy lời mời thất bại!");
                }
            },
        };
    } else if (isReceivedPending) {
        buttonProps = {
            text: "Xác nhận lời mời",
            color: "bg-green-500 text-white hover:bg-green-600",
            onClick: async () => {
                try {
                    await acceptRequest(isReceivedPending.id).unwrap();
                    toast.success("Xác nhận lời mời thành công!");
                } catch (err) {
                    toast.error("Xác nhận lời mời thất bại!");
                }
            },
        };
    } else {
        buttonProps = {
            text: "Kết bạn",
            color: "bg-blue-500 text-white hover:bg-blue-600",
            onClick: async () => {
                try {
                    await sendRequest(user.id).unwrap();
                    toast.success("Gửi lời mời thành công!");
                } catch (err) {
                    toast.error("Gửi lời mời thất bại!");
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
            className={`${buttonProps.color} transition-colors duration-200 rounded-md px-4 py-2 shadow-sm`}
        >
            {buttonProps.text}
        </button>
    );
};

export default ActionButton;
