import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Xóa cookie đăng nhập
    document.cookie =
      "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Xóa localStorage nếu muốn
    localStorage.removeItem("currentUser");
    // Chuyển hướng về trang login
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 transition text-gray-800 cursor-pointer"
      style={{ background: "none", border: "none" }}
    >
      <span className="mr-2">
        <LogOut className="w-5 h-5 text-gray-500" />
      </span>
      Đăng xuất
    </button>
  );
}
