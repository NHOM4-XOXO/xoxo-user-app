import { useState } from "react";
import { contactsData, groupChatsData } from "@/data/rightSidebarData";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import SettingsDropdown from "@/components/RightSidebar-Home/SettingsDropdown";

const RightSideBar = ({ isSettingsOpen, setIsSettingsOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contactsData.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Contacts List */}
      <div className="px-2">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center p-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors group"
          >
            <div className="relative">
              <img
                src={contact.avatar || "/placeholder.svg"}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 ${
                  contact.isOnline ? "bg-green-500" : "bg-red-500"
                } border-2 border-gray-300 dark:border-gray-900 rounded-full`}
              ></div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-gray-600 dark:text-white truncate">
                  {contact.name}
                </p>
                {contact.lastSeen && (
                  <span className="text-xs text-gray-400 ml-2">
                    {contact.lastSeen}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Chats Section */}
      <div className="mt-6 px-3 md:px-4">
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Nhóm chat
          </h3>

          {groupChatsData.map((group) => (
            <div
              key={group.id}
              className="flex items-center p-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors mb-2"
            >
              <div className="relative">
                <img
                  src={group.avatar || "/placeholder.svg"}
                  alt={group.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-600 dark:text-white truncate">
                    {group.name}
                  </p>
                  <span className="text-xs text-gray-400 ml-2">
                    {group.lastActivity}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Create Group Chat Button */}
          <div className="flex items-center p-2 hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors mt-4">
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
