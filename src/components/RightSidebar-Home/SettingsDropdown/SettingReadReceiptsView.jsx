import { ArrowLeft } from "lucide-react";

const SettingReadReceiptsView = ({ goBack, toggleSetting, settings }) => (
  <div>
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
          Thông báo đã đọc
        </h3>
      </div>
    </div>

    {/* Read Receipts Settings */}
    <div className="py-2">
      <div className="p-2">
        <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
          <div>
            <div className="text-sm font-medium text-black dark:text-white mb-2">
              Hiển thị thông báo đã đọc
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Mọi người sẽ không biết khi bạn đọc tin nhắn của họ và ngược lại.
            </div>
          </div>
          <button
            onClick={() => toggleSetting("readReceipts")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.readReceipts ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.readReceipts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SettingReadReceiptsView;
