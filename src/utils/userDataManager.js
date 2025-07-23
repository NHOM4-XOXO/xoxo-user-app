export const userDataManager = {
  saveUser: (userData) => {
    try {
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );

      // Kiểm tra email/phone đã tồn tại chưa
      const userExists = existingUsers.some(
        (user) => user.email === userData.email
      );

      if (userExists) {
        throw new Error("Email hoặc số điện thoại đã được sử dụng!");
      }

      const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isVerified: false,
        lastLogin: null,
      };

      existingUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

      return newUser;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: () => {
    try {
      return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  },

  findUserByEmail: (email) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      return users.find((user) => user.email === email);
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  },

  findUserByEmailOrPhone: (emailOrPhone) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      return users.find(
        (user) => user.email === emailOrPhone || user.phone === emailOrPhone
      );
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  },

  updateUser: (userId, updateData) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userIndex = users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        throw new Error("Không tìm thấy user!");
      }

      users[userIndex] = { ...users[userIndex], ...updateData };
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      return users[userIndex];
    } catch (error) {
      console.error("Lỗi trong updateUser:", error);
      throw error;
    }
  },

  deleteUser: (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const filteredUsers = users.filter((user) => user.id !== userId);
      localStorage.setItem("registeredUsers", JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  },

  verifyUser: (userId) => {
    try {
      return userDataManager.updateUser(userId, { isVerified: true });
    } catch (error) {
      throw error;
    }
  },

  loginUser: (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Email hoặc mật khẩu không đúng!");
      }

      // Cập nhật thời gian đăng nhập cuối
      const updatedUser = userDataManager.updateUser(user.id, {
        lastLogin: new Date().toISOString(),
      });

      // Lưu thông tin user đang đăng nhập
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error("Lỗi trong loginUser:", error);
      throw error;
    }
  },

  logoutUser: () => {
    localStorage.removeItem("currentUser");
  },

  // Lấy user hiện tại
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
      return null;
    }
  },

  // Kiểm tra user đã đăng nhập chưa
  isLoggedIn: () => {
    return userDataManager.getCurrentUser() !== null;
  },

  // Cập nhật mật khẩu user
  updatePassword: (userId, newPassword) => {
    try {
      return userDataManager.updateUser(userId, { password: newPassword });
    } catch (error) {
      throw error;
    }
  },
};

export default userDataManager;
