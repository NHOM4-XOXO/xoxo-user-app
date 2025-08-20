"use client";

const suggestedGroups = [
  {
    id: 1,
    name: "Nhóm mua bán điện thoại",
    description: "Nhóm chia sẻ thông tin mua bán điện thoại uy tín",
    members: "12,500 thành viên",
    postsPerDay: "Khoảng 20 bài viết mỗi ngày",
    image: "/image/group1.jpg",
    privacy: "Công khai",
  },
  {
    id: 2,
    name: "Học lập trình JavaScript",
    description: "Cộng đồng học lập trình JavaScript từ cơ bản đến nâng cao",
    members: "8,300 thành viên",
    postsPerDay: "Khoảng 15 bài viết mỗi ngày",
    image: "/image/group2.jpg",
    privacy: "Công khai",
  },
  {
    id: 3,
    name: "Ẩm thực Việt Nam",
    description: "Chia sẻ các món ăn ngon và công thức nấu ăn",
    members: "25,800 thành viên",
    postsPerDay: "Khoảng 50 bài viết mỗi ngày",
    image: "/image/group1.jpg",
    privacy: "Công khai",
  },
];

export default function GroupsDiscovery() {
  return (
    <div className="space-y-6 -mt-6 p-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Khám phá nhóm
      </h2>
      <p className="text-gray-600">Tìm nhóm phù hợp với sở thích của bạn</p>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Danh mục phổ biến
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: "Mua bán",
              icon: "🛒",
              color: "bg-green-100 text-green-800",
            },
            { name: "Học tập", icon: "📚", color: "bg-blue-100 text-blue-800" },
            {
              name: "Ẩm thực",
              icon: "🍽️",
              color: "bg-orange-100 text-orange-800",
            },
            {
              name: "Du lịch",
              icon: "✈️",
              color: "bg-purple-100 text-purple-800",
            },
            { name: "Thể thao", icon: "⚽", color: "bg-red-100 text-red-800" },
            {
              name: "Công nghệ",
              icon: "💻",
              color: "bg-gray-100 text-gray-800",
            },
            {
              name: "Nghệ thuật",
              icon: "🎨",
              color: "bg-pink-100 text-pink-800",
            },
            {
              name: "Âm nhạc",
              icon: "🎵",
              color: "bg-indigo-100 text-indigo-800",
            },
          ].map((category, index) => (
            <button
              key={index}
              className={`flex items-center space-x-2 p-3 rounded-lg hover:opacity-80 ${category.color}`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Nhóm được đề xuất
        </h3>
        <div className="space-y-4">
          {suggestedGroups.map((group) => (
            <div
              key={group.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {group.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {group.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{group.members}</span>
                        <span>•</span>
                        <span>{group.postsPerDay}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span>🌍</span>
                          <span>{group.privacy}</span>
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                      Tham gia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">➕</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tạo nhóm của riêng bạn
          </h3>
          <p className="text-gray-600 mb-4">
            Xây dựng cộng đồng xung quanh sở thích và mối quan tâm của bạn
          </p>
          <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
            Tạo nhóm mới
          </button>
        </div>
      </div>
    </div>
  );
}
