import { ArrowLeft } from "lucide-react";
import Divider from "../../../common/Divider";

const SettingEncryptedChatsView = ({ goBack }) => (
  <>
    {/* Header */}
    <div className="p-2 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center space-x-1">
        <button
          onClick={goBack}
          className="p-1 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-7 h-7 text-gray-600 dark:text-gray-300" />
        </button>
        <h3 className="text-base font-semibold text-black dark:text-white">
          Đoạn chat được mã hóa đầu cuối
        </h3>
      </div>
    </div>

    {/* Encrypted Chats Settings */}
    <div className="p-2">
      <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
        <div className="space-x-3">
          <div>
            <span className="text-sm font-medium text-black dark:text-white block">
              Lưu trữ tin nhắn
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Quản lý cách bạn lưu trữ và truy cập vào lịch sử chat.
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
          Bật
        </span>
      </div>

      <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
        <div className="space-x-3">
          <div>
            <span className="text-sm font-medium text-black dark:text-white block">
              Cảnh báo bảo mật
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Xem, quản lý cảnh báo về lần đăng nhập và thay đổi khóa
            </span>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
        <div className="space-x-3">
          <div>
            <span className="text-sm font-medium text-black dark:text-white block">
              Bản xem trước
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Xem trước nội dung trên Facebook
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
          Bật
        </span>
      </div>
    </div>
  </>
);

export default SettingEncryptedChatsView;
