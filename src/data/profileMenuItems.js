// profileMenuItems.js
export const getProfileMenuItems = () => {
    let username = "";

    try {
        const auth = JSON.parse(localStorage.getItem("auth"));
        username = auth?.profile?.username || "";
    } catch (e) {
        console.error("Không đọc được localStorage:", e);
    }

    return [
      {
        id: 1,
        label: "Xem Trang Cá Nhân",
        type: "item",
        href: `/profile/${username}`,
      },
      { id: 2, label: "Đổi mật khẩu", type: "item", href: "/change-password" },
      { id: 3, label: "Tuỳ Chỉnh Giao Diện", type: "item", href: "" },
      { id: 4, type: "divider" },
      { id: 5, label: "Đăng Xuất", type: "item", href: "/login" },
    ];
};
