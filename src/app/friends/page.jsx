import SidebarFriend from "@/components/friends/SideFriends";
import FriendRequestCard from "../../components/friends/FriendRequestCard";
import sampleFriends from "@/data/sampleFriends";

export default function FriendsPage() {
  return (
    <div className="flex bg-white min-h-screen dark:text-white dark:bg-black">
      <SidebarFriend />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">
            Lời mời kết bạn
          </h1>
          <a href="#" className="text-blue-500 hover:underline">
            Xem tất cả
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sampleFriends.map((user, idx) => (
            <FriendRequestCard
              key={idx}
              avatar={user.avatar}
              name={user.name}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
