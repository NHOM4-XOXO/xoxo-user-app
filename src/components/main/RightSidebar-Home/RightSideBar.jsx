"use client";
"use client";
import { useState, useMemo } from "react";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { useChatList } from "@/hooks/useChatList";
import { useGetCurrentUserProfileQuery, useGetUserByIdQuery } from "@/features/chatApi";
import Cookies from "js-cookie";

export const dynamic = "force-dynamic";

const RightSideBar = ({
  isSettingsOpen,
  setIsSettingsOpen,
  onContactClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Load real chat rooms
  const { chatRooms, isLoadingChatRooms, markChatAsRead } = useChatList();

  // Current user id
  const { data: profile } = useGetCurrentUserProfileQuery();
  const getCurrentUserId = () => {
    try {
      if (profile?.id) return Number(profile.id);
      const token = Cookies.get("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.userId || payload.id || payload.sub);
    } catch (_) {
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  const normalizeChatRoom = (room) => {
    const lastMsgObj = typeof room.lastMessage === 'object' && room.lastMessage !== null
      ? room.lastMessage
      : {
          content: room.lastMessageContent || (typeof room.lastMessage === 'string' ? room.lastMessage : ''),
          sentAt: room.lastMessageAt || room.lastMessage?.sentAt,
        };

    return {
      ...room,
      lastMessage: lastMsgObj,
      lastMessageAt: room.lastMessageAt || lastMsgObj?.sentAt || room.updatedAt,
    };
  };

  const filteredChatRooms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!Array.isArray(chatRooms)) return [];
    const normalized = chatRooms.map(normalizeChatRoom);
    if (!term) return normalized;
    return normalized.filter((room) =>
      (room.name || "").toLowerCase().includes(term)
    );
  }, [chatRooms, searchTerm]);

  const convertChatRoomToContact = (chatRoom) => {
    // Resolve other participant id reliably
    const ids = Array.isArray(chatRoom.participantIds)
      ? chatRoom.participantIds.map((id) => Number(id))
      : [];
    const otherId = currentUserId != null
      ? (ids.find((id) => id !== Number(currentUserId)) ?? ids[0])
      : ids[0];

    // Compute safe display name (avoid showing my own name)
    const currentUserName = profile
      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || profile.email
      : null;
    let safeName = getDisplayName(chatRoom);
    if (currentUserName && safeName === currentUserName) {
      // Defer to ChatBubble API resolution; placeholder until user API returns
      safeName = otherId != null ? `User ${otherId}` : safeName;
    }

    return {
      id: chatRoom.id,
      userId: otherId,
      name: safeName,
      avatar: chatRoom.avatarUrl || "/default-avatar.jpg",
      isOnline: chatRoom.isOnline,
      chatRoom,
    };
  };

  const getDisplayName = (room) => {
    // Build current user's display name if possible to avoid showing own name
    const currentUserName = profile
      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || profile.email
      : null;

    if (room?.otherParticipantName) return room.otherParticipantName;

    // If we have parallel arrays of ids and names, pick the other participant's name
    if (
      Array.isArray(room?.participantIds) &&
      Array.isArray(room?.participantNames) &&
      room.participantIds.length === room.participantNames.length &&
      currentUserId != null
    ) {
      const idx = room.participantIds.findIndex((id) => Number(id) !== Number(currentUserId));
      if (idx >= 0 && room.participantNames[idx]) return room.participantNames[idx];
    }

    // Use room name if it's not obviously the current user's name
    if (
      room?.name &&
      String(room.name).trim().toLowerCase() !== 'null' &&
      (!currentUserName || room.name !== currentUserName)
    ) {
      return room.name;
    }

    // Fallback
    return `Phòng #${room?.id ?? '?'}`;
  };

  const RightSidebarChatItem = ({ room, onClick }) => {
    let otherParticipantId = null;
    if (Array.isArray(room?.participantIds) && currentUserId != null) {
      otherParticipantId = room.participantIds.find((id) => Number(id) !== Number(currentUserId)) ?? null;
    }

    const { data: userData } = useGetUserByIdQuery(otherParticipantId, { skip: otherParticipantId == null });

    const displayName = userData
      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || userData.email
      : getDisplayName(room);

    const avatarUrl = userData?.avatarUrl || room.avatarUrl || "/default-avatar.jpg";

    return (
      <div
        className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary"
        onClick={() => onClick(room)}
      >
        <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700 dark:text-white truncate">{displayName}</p>
            {room.lastMessageAt && (
              <span className="text-xs text-gray-500">
                {new Date(room.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 xl:w-96 bg-fb-light-secondary dark:bg-fb-dark-primary text-white h-[calc(100vh-56px)] border-gray-700 hidden xl:block">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Người liên hệ
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary rounded-full transition-colors cursor-pointer">
              <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary rounded-full transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="px-2">
        {isLoadingChatRooms ? (
          <div className="p-4 text-center text-gray-500">Đang tải cuộc trò chuyện…</div>
        ) : (
          filteredChatRooms.map((room) => (
            <RightSidebarChatItem
              key={room.id}
              room={room}
              onClick={(r) => onContactClick(convertChatRoomToContact(r))}
            />
          ))
        )}
      </div>

      {/* Create Group Chat Button */}
      <div className="mt-6 px-3 md:px-4">
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
          <div className="flex items-center p-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-white">
                Tạo nhóm chat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
