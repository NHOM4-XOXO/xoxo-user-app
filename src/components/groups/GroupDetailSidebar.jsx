"use client";

import { HEADER_HEIGHT } from "@/constants";
let user = localStorage.getItem("auth");
user = JSON.parse(user);
if(user && user.profile){
  var userName = user.profile.firstName + " " + user.profile.lastName;  
  var userAvatar = user.profile.avatarUrl;
} else {
  let userName = "User";
  let userAvatar = "/image/georgina.jpg";
}

export default function GroupDetailSidebar({ group }) {
  const quickActions = [
    {
      icon: "💬",
      text: "Chat về những gì quan trọng với bạn",
      subtext:
        "Hãy gọi ý một chủ đề chat để nhóm kết nối với nhau tức thì. Khi quản trị viên phê duyệt gợi ý của bạn, đoạn chat sẽ được tạo.",
    },
    { icon: "🎉", text: "Gợi ý chủ đề chat mới", subtext: "" },
  ];

  return (
    <div
      className="space-y-4"
      style={{ maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">{action.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {action.text}
                  </p>
                  {action.subtext && (
                    <p className="text-xs text-gray-600 mt-1">
                      {action.subtext}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          ➕ Gợi ý chủ đề chat mới
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Hoạt động gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">5 thành viên</span> đã tham gia hôm
              nay
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">12 bài viết</span> trong tuần này
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">3 sự kiện</span> sắp diễn ra
            </div>
          </div>
        </div>
      </div>

      {/* Admin & Moderators */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Quản trị viên & người kiểm duyệt
        </h3>
        <div className="space-y-3">
          {[
            {
              name: "Nguyễn Văn A",
              role: "Quản trị viên",
              avatar: "/default-avatar.jpg",
            },
            {
              name: "Trần Thị B",
              role: "Người kiểm duyệt",
              avatar: userAvatar || "/image/georgina.jpg",
            },
          ].map((person, index) => (
            <div key={index} className="flex items-center space-x-3">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {person.name}
                </p>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Rules */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Quy tắc nhóm</h3>
        <div className="space-y-2">
          {[
            "Tôn trọng các thành viên khác",
            "Không spam hoặc quảng cáo",
            "Chia sẻ nội dung liên quan đến âm nhạc",
            "Sử dụng ngôn ngữ phù hợp",
          ].map((rule, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-blue-600 text-sm font-medium">
                {index + 1}.
              </span>
              <p className="text-sm text-gray-600">{rule}</p>
            </div>
          ))}
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
          Xem tất cả quy tắc
        </button>
      </div>
    </div>
  );
}
