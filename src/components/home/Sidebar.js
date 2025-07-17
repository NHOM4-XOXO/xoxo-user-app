"use client";

export default function Sidebar({ user }) {
  const menuItems = [
    {
      icon: (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      ),
      label: user.name,
      href: "/profile",
      isUser: true,
    },
    {
      icon: (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      label: "Meta AI",
      href: "/meta-ai",
    },
    {
      icon: (
        <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        </div>
      ),
      label: "Bạn bè",
      href: "/friends",
    },
    {
      icon: (
        <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
      label: "Kỷ niệm",
      href: "/memories",
    },
    {
      icon: (
        <div className="w-full h-full bg-purple-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
          </svg>
        </div>
      ),
      label: "Đã lưu",
      href: "/saved",
    },
    {
      icon: (
        <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
      ),
      label: "Nhóm",
      href: "/groups",
    },
    {
      icon: (
        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
      label: "Thước phim",
      href: "/reels",
    },
    {
      icon: (
        <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
      label: "Marketplace",
      href: "/marketplace",
    },
  ];

  const shortcuts = [
    {
      name: "GIÚP TƯƠI CẤY SHOPEE",
      icon: (
        <div className="w-full h-full bg-orange-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
      ),
    },
    {
      name: "MUA BÁN XE BA GÁC CŨ MỚI",
      icon: (
        <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="w-80 h-screen overflow-y-auto sticky top-14 bg-white">
      <div className="p-2 space-y-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <div className="w-9 h-9 flex-shrink-0">{item.icon}</div>
            <span className="font-medium text-gray-900 text-sm">
              {item.label}
            </span>
          </div>
        ))}

        <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-full transition-colors duration-200">
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span className="font-medium text-gray-900 text-sm">Xem thêm</span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="px-2">
          <h3 className="font-semibold text-gray-600 mb-3 text-sm">
            Lối tắt của bạn
          </h3>
          <div className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <div className="w-9 h-9 flex-shrink-0">{shortcut.icon}</div>
                <span className="font-medium text-gray-900 text-sm leading-tight">
                  {shortcut.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
