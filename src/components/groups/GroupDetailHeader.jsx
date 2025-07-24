"use client";

export default function GroupDetailHeader({ group }) {
  return (
    <div className="bg-white shadow-sm">
      {/* Cover Photo */}
      <div className="relative h-80 bg-gradient-to-r from-blue-400 to-purple-500">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Group Title Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span>{group.description}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Member Avatars */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {group.memberAvatars.slice(0, 5).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Member ${index + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{group.members}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <span>➕</span>
                <span>Mời</span>
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center space-x-2">
                <span>✏️</span>
                <span>Chia sẻ</span>
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center space-x-2">
                <span>⚙️</span>
                <span>Đã tham gia</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
