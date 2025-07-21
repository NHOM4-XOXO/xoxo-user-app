import { ArrowLeft, ChevronRight } from "lucide-react";

const SettingPrivacyView = ({ goBack, navigateTo }) => (
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
          Quyền riêng tư và an toàn
        </h3>
      </div>
    </div>

    {/* Privacy Settings */}
    <div className="p-2">
      <div
        className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors"
        onClick={() => navigateTo("encryptedChats")}
      >
        <div className="space-x-3">
          <div>
            <span className="text-sm font-medium text-black dark:text-white block">
              Đoạn chat được mã hóa đầu cuối
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Quản lý cài đặt đoạn chat được mã hóa đầu cuối
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>

      <div
        className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors"
        onClick={() => navigateTo("readReceipts")}
      >
        <div className="space-x-3">
          <div>
            <span className="text-sm font-medium text-black dark:text-white block">
              Thông báo đã đọc
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Bật</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>

      <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
        <div className="space-x-3">
          <div>
            <span className="text-sm font-medium text-black dark:text-white block">
              Đoạn chat đã báo cáo
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Xem thông tin mới về báo cáo của bạn
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default SettingPrivacyView;
