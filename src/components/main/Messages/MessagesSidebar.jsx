"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MoreHorizontal, Edit } from "lucide-react";
import ScrollableContainer from "@/components/common/ScrollableContainer";
import OnlineFriends from "./OnlineFriends";

export default function MessagesSidebar({
  selectedContact,
  onSelectContact,
  contacts,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, unread, groups

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full bg-fb-light-primary dark:bg-fb-dark-secondary">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 dark:border-fb-dark-tertiary">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Đoạn chat</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 transition-colors rounded-full cursor-pointer bg-fb-light-secondary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button className="p-2 transition-colors rounded-full cursor-pointer bg-fb-light-secondary dark:bg-fb-dark-tertiary hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm rounded-full bg-fb-light-secondary dark:bg-fb-dark-tertiary focus:outline-none focus:ring-1 focus:ring-fb-dark-quaternary"
          />
        </div>
      </div>

      {/* Online Friends */}
      {!searchTerm && (
        <div className="p-4 border-b border-gray-300 dark:border-fb-dark-tertiary">
          <OnlineFriends
            contacts={contacts.filter((contact) => contact.isOnline)}
            onSelectContact={onSelectContact}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-fb-dark-tertiary">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "unread"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Chưa đọc
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "groups"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          Nhóm
        </button>
      </div>

      {/* Conversations List */}
      <ScrollableContainer className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedContact?.id === contact.id
                  ? "bg-[#EBF5FF] dark:bg-[#24313E]"
                  : "hover:bg-fb-light-tertiary dark:hover:bg-fb-dark-quaternary"
              }`}
            >
              <div className="relative">
                <Image
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.name}
                  width={48}
                  height={48}
                  className="object-cover rounded-full"
                />
                {contact.isOnline && (
                  <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 ml-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">
                    {contact.lastSeen || "2 phút"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate dark:text-gray-400">
                  Bạn: Chào bạn nhé! 👋
                </p>
              </div>
              {/* Unread indicator */}
              <div className="w-3 h-3 ml-2 bg-blue-600 rounded-full"></div>
            </div>
          ))}
        </div>
      </ScrollableContainer>
    </div>
  );
}
