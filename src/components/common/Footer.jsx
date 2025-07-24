export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="./logo_xoxo_500px-removebg-preview.png"
                alt="XOXO"
                className="h-10 w-10 rounded-full mr-3"
              />
              <span className="text-xl font-bold text-blue-600">XOXO</span>
            </div>
            <p className="text-gray-600 text-xm">
              Kết nối, chia sẻ và khám phá thế giới cùng bạn bè.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 ml-32">
            <h3 className="font-semibold text-gray-900">Tính năng</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Đăng ký
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-600 transition-colors">
                  Đăng nhập
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Chia sẻ bài viết
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Chat trực tuyến
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Nhóm cộng đồng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Chia sẻ ảnh/video
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 ml-32">
            <h3 className="font-semibold text-gray-900">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Báo cáo sự cố
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2025 XOXO Social Network. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span onClick={() => changeLanguage("vi")}>Tiếng Việt</span>
              <span onClick={() => changeLanguage("en")}>English</span>
              <span className="text-blue-600">+47 ngôn ngữ khác</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
