"use client";

import { useGetSuggestionsQuery, useSendRequestMutation } from "@/features/friendshipApi";

export default function FriendSuggestionsPage() {
    const { data: suggestions = [], isLoading } = useGetSuggestionsQuery();
    const [sendRequest] = useSendRequestMutation();

    const handleSendRequest = async (userId) => {
        try {
            await sendRequest(userId).unwrap();
        } catch (err) {
            console.error("Send request failed:", err);
        }
    };

    return (

        <div className="flex-1 p-4 lg:ml-72 space-y-6">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Gợi ý bạn bè
            </h1>

            {isLoading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {suggestions.map((friend) => (
                        <div key={friend.id} className="rounded-lg overflow-hidden shadow-md border dark:border-gray-700 bg-white dark:bg-[#242526]">
                            {/* Avatar */}
                            <div className="relative w-full h-40 sm:h-48">
                                <img src={friend.avatarUrl} alt={friend.username} className="object-cover w-full h-full" />
                            </div>

                            {/* Info + Button */}
                            <div className="p-3 text-center text-black dark:text-white">
                                <p className="font-semibold truncate">{friend.firstName} {friend.lastName}</p>
                                <button
                                    onClick={() => handleSendRequest(friend.id)}
                                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded font-medium w-full"
                                >
                                    Thêm bạn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
