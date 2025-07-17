"use client";

export default function RightSidebar() {
  const contacts = [
    { name: "Phan Hào Hào", avatar: "/api/placeholder/32/32", online: true },
    { name: "Nguyễn Văn A", avatar: "/api/placeholder/32/32", online: false },
    { name: "Trần Thị B", avatar: "/api/placeholder/32/32", online: true },
  ];

  const sponsoredContent = [
    {
      title: "Cài trên máy tính = 150 USDT",
      subtitle: "binance.com",
      image: "/api/placeholder/80/80",
      badge: "5",
    },
    {
      title: "Các Thủ Thuật Tối Ưu Hóa Sử Dụng React Hooks Trong...",
      subtitle: "tech.cybozu.vn",
      image: "/api/placeholder/80/80",
    },
  ];

  return (
    <div className="w-80 h-screen overflow-y-auto p-4 bg-white sticky top-14">
      {/* Được tài trợ */}
      <div className="mb-6">
        <h3 className="text-gray-600 font-semibold mb-3">Được tài trợ</h3>
        <div className="space-y-3">
          {sponsoredContent.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  <div className="text-white text-2xl">⚡</div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lời mời kết bạn */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-semibold">Lời mời kết bạn</h3>
          <button className="text-blue-600 text-sm hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🏔️</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Phan Hào Hào</h4>
                <p className="text-xs text-gray-500">28 bạn chung</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                Xác nhận
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Người liên hệ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-semibold">Người liên hệ</h3>
          <div className="flex space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
