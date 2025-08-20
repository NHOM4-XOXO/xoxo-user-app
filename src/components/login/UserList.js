"use client";

import { useState, useEffect } from "react";
import userDataManager from "../../utils/userDataManager";
import { useUser } from "../../contexts/UserContext";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const { currentUser, logout, refreshUser } = useUser();

  useEffect(() => {
    // Load users when component mounts
    setUsers(userDataManager.getAllUsers());
  }, []);
  

  const handleRefresh = () => {
    setUsers(userDataManager.getAllUsers());
    refreshUser();
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Bạn có chắc muốn xóa user này?")) {
      userDataManager.deleteUser(userId);
      handleRefresh();
    }
  };

  const handleVerifyUser = (userId) => {
    try {
      userDataManager.verifyUser(userId);
      handleRefresh();
      alert("User đã được xác thực!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleLogout = () => {
    logout();
    alert("Đã đăng xuất!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Users</h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {currentUser && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-green-800">
                  User đang đăng nhập:
                </h3>
                <p className="text-green-700">
                  {currentUser.firstName} {currentUser.lastName} (
                  {currentUser.email})
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Danh sách Users đã đăng ký ({users.length})
          </h3>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có user nào đăng ký
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    ID
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Họ tên
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Email
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Giới tính
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Ngày sinh
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Trạng thái
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {user.gender === "male"
                        ? "Nam"
                        : user.gender === "female"
                          ? "Nữ"
                          : "Khác"}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {new Date(user.birthday).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-2 border-b text-sm">
                      <div className="flex space-x-2">
                        {!user.isVerified && (
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            Xác thực
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
