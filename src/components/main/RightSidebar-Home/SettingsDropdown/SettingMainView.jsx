import {
  Ban,
  ChevronRight,
  Circle,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Users,
} from "lucide-react";
import Divider from "../../../common/Divider";

const SettingMainView = ({ settings, toggleSetting, setCurrentView }) => (
  <>
    {/* Header */}
    <div className="p-4 border-b border-gray-300 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
        Cài đặt đoạn chat
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Tùy chỉnh trải nghiệm trên Messenger.
      </p>
    </div>

    {/* Settings List */}
    <div className="py-2">
      {/* Toggle Settings */}
      <div className="p-2">
        <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Âm thanh cuộc gọi đến
            </span>
          </div>
          <button
            onClick={() => toggleSetting("incomingCallSounds")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.incomingCallSounds ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.incomingCallSounds ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Âm thanh tin nhắn
            </span>
          </div>
          <button
            onClick={() => toggleSetting("messageSounds")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.messageSounds ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.messageSounds ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
          <div className="flex space-x-3">
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <span className="text-sm font-medium text-black dark:text-white block">
                Tin nhắn mới bật lên
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Tự động mở tin nhắn mới.
              </span>
            </div>
          </div>
          <button
            onClick={() => toggleSetting("newMessagePopups")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.newMessagePopups ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.newMessagePopups ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <Divider />

      <div className="px-2">
        <div className="flex items-center justify-between p-2 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary rounded-lg cursor-pointer transition-colors">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Hiển thị danh bạ
            </span>
          </div>
          <button
            onClick={() => toggleSetting("showContacts")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.showContacts ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.showContacts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <Divider />

      {/* Menu Items */}
      <div className="px-2">
        <button
          className="flex items-center justify-between w-full py-3 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary cursor-pointer rounded-lg px-2 transition-colors"
          onClick={() => setCurrentView("privacy")}
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Quyền riêng tư và an toàn
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button className="flex items-center justify-between w-full py-3 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary cursor-pointer rounded-lg px-2 transition-colors">
          <div className="flex items-center space-x-3">
            <Circle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Trạng thái hoạt động:{" "}
              <span className="text-green-500">ĐANG BẬT</span>
            </span>
          </div>
        </button>

        <button className="flex items-center justify-between w-full py-3 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary cursor-pointer rounded-lg px-2 transition-colors">
          <div className="flex items-center space-x-3">
            <Send className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Cài đặt gửi tin nhắn
            </span>
          </div>
        </button>

        <button className="flex items-center justify-between w-full py-3 hover:bg-fb-light-quaternary dark:hover:bg-fb-dark-tertiary cursor-pointer rounded-lg px-2 transition-colors">
          <div className="flex items-center space-x-3">
            <Ban className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-black dark:text-white">
              Cài đặt chặn
            </span>
          </div>
        </button>
      </div>
    </div>
  </>
);

export default SettingMainView;
