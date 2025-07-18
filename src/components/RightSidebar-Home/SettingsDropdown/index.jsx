import { useState } from "react";
import SettingReadReceiptsView from "./SettingReadReceiptsView";
import SettingEncryptedChatsView from "./SettingEncryptedChatsView";
import SettingMainView from "./SettingMainView";
import SettingPrivacyView from "./SettingPrivacyView";

const SettingsDropdown = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    incomingCallSounds: true,
    messageSounds: true,
    newMessagePopups: true,
    showContacts: true,
    readReceipts: true,
    messageStorage: true,
    securityAlerts: false,
    preview: true,
  });

  const [currentView, setCurrentView] = useState("main"); // main, privacy, readReceipts, encryptedChats

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const goBack = () => {
    if (currentView === "readReceipts" || currentView === "encryptedChats") {
      setCurrentView("privacy");
    } else if (currentView === "privacy") {
      setCurrentView("main");
    }
  };

  if (!isOpen) return null;

  const renderCurrentView = () => {
    switch (currentView) {
      case "privacy":
        return <SettingPrivacyView goBack={goBack} navigateTo={navigateTo} />;
      case "readReceipts":
        return (
          <SettingReadReceiptsView
            goBack={goBack}
            toggleSetting={toggleSetting}
            settings={settings}
          />
        );
      case "encryptedChats":
        return <SettingEncryptedChatsView goBack={goBack} />;
      default:
        return (
          <SettingMainView
            setCurrentView={setCurrentView}
            settings={settings}
            toggleSetting={toggleSetting}
          />
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute top-24 right-16 w-80 xl:w-96 max-h-11/12 overflow-y-auto bg-fb-light-primary dark:bg-fb-dark-secondary rounded-lg shadow-2xl z-50 border border-gray-300 dark:border-gray-700">
        {renderCurrentView()}
      </div>
    </>
  );
};

export default SettingsDropdown;
