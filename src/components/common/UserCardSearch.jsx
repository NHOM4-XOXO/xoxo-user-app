import Link from "next/link";
import ActionButton from "../ActionButtonSearch";
import { useIsFriendQuery } from "@/features/friendshipApi";

function UserCard({ user, profile, sentPending, receivedPending }) {
    const isMe = profile && profile.id === user.id;

    const { data: friendData, isLoading } = useIsFriendQuery(user.id);
    const isFriend = friendData?.areFriends === true;

    const isSentPending = sentPending?.find(
        (item) => item.friend.id === user.id && item.status === "PENDING"
    );
    const isReceivedPending = receivedPending?.find(
        (item) => item.user.id === user.id && item.status === "PENDING"
    );

    const badge = isMe
        ? { text: "Bạn", color: "bg-blue-500" }
        : isFriend
            ? { text: "Bạn bè", color: "bg-green-500" }
            : { text: "Mọi người", color: "bg-gray-400" };

    if (isLoading) {
        return <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    }
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 hover:cursor-pointer">
                <img
                    src={user.avatarUrl || "/default-avatar.jpg"}
                    alt={user.username}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">
                            <Link href={`/profile/${user.username}`}>
                                {user.firstName} {user.lastName}
                            </Link>
                        </h3>
                        <span
                            className={`text-xs ${badge.color} text-white px-2 py-0.5 rounded-full`}
                        >
                            {badge.text}
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                    {user.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {user.bio}
                        </p>
                    )}
                </div>

                <ActionButton
                    user={user}
                    isMe={isMe}
                    isFriend={friendData?.friendshipId}
                    isSentPending={isSentPending}
                    isReceivedPending={isReceivedPending}
                />
            </div>
        </div>
    );
}

export default UserCard;
