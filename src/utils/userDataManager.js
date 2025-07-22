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
      console.log("Tìm user với email:", email);
      console.log("Tất cả users:", users);
      const foundUser = users.find((user) => user.email === email);
      console.log("Tìm thấy user:", foundUser);
      return foundUser;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  },

  findUserByEmailOrPhone: (emailOrPhone) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      console.log("Tìm user với email/phone:", emailOrPhone);
      const foundUser = users.find(
        (user) => user.email === emailOrPhone || user.phone === emailOrPhone
      );
      console.log("Tìm thấy user:", foundUser);
      return foundUser;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  },

  updateUser: (userId, updateData) => {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      console.log("Tất cả users trước khi update:", users);
      console.log("Đang update user ID:", userId, "với data:", updateData);

      const userIndex = users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        console.error("Không tìm thấy user với ID:", userId);
        throw new Error("Không tìm thấy user!");
      }

      users[userIndex] = { ...users[userIndex], ...updateData };
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      console.log("User sau khi update:", users[userIndex]);
      console.log("Tất cả users sau khi update:", users);

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
      console.log("Tất cả users trong loginUser:", users);
      console.log("Đăng nhập với email:", email, "và password:", password);

      // Debug: hiển thị mật khẩu của user có email này
      const userWithEmail = users.find((u) => u.email === email);
      if (userWithEmail) {
        console.log(
          `💡 User với email ${email} có mật khẩu là: "${userWithEmail.password}"`
        );
        console.log(` Mật khẩu bạn nhập: "${password}"`);
        console.log(` Khớp mật khẩu: ${userWithEmail.password === password}`);
      } else {
        console.log(` Không tìm thấy user với email: ${email}`);
      }

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        console.log("Không tìm thấy user với email/password này");
        throw new Error("Email hoặc mật khẩu không đúng!");
      }

      console.log("Tìm thấy user:", user);

      // Cập nhật thời gian đăng nhập cuối
      const updatedUser = userDataManager.updateUser(user.id, {
        lastLogin: new Date().toISOString(),
      });

      // Lưu thông tin user đang đăng nhập (lấy user sau khi đã update)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      console.log("✅ Đã lưu currentUser:", updatedUser);

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
