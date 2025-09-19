"use client";

import { useState } from "react";
import { useCreateReportMutation } from "@/features/reportApi";

const REPORT_REASONS = [
  { value: "SPAM", label: "Spam" },
  { value: "HARASSMENT", label: "Quấy rối" },
  { value: "HATE_SPEECH", label: "Phát ngôn thù hận" },
  { value: "VIOLENCE", label: "Bạo lực" },
  { value: "NUDITY", label: "Khỏa thân" },
  { value: "FALSE_INFORMATION", label: "Thông tin sai lệch" },
  { value: "COPYRIGHT_INFRINGEMENT", label: "Vi phạm bản quyền" },
  { value: "IMPERSONATION", label: "Mạo danh"},
  { value: "SCAM_OR_FRAUD", label: "Lừa đảo" },
  {
    value: "INAPPROPRIATE_CONTENT",
    label: "Nội dung không phù hợp",
  },
  { value: "OTHER", label: "Khác" },
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType = "POST",
  targetId,
}) {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [step, setStep] = useState(1); // 1: chọn lý do, 2: chi tiết, 3: thành công

  const [createReport, { isLoading }] = useCreateReportMutation();

  const handleSubmit = async () => {
    if (!selectedReason) return;

    try {
      await createReport({
        reportTargetType: targetType,
        reportTargetId: targetId,
        reportReason: selectedReason,
        additionalInfo,
        isAnonymous,
        priority: 3,
      }).unwrap();

      setStep(3);
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedReason("");
    setAdditionalInfo("");
    setIsAnonymous(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {step === 1 && "Báo cáo bài viết"}
            {step === 2 && "Chi tiết báo cáo"}
            {step === 3 && "Đã gửi báo cáo"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Chọn lý do */}
        {step === 1 && (
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              Tại sao bạn báo cáo bài viết này?
            </p>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    selectedReason === reason.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{reason.icon}</span>
                    <span>{reason.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedReason}
                className={`px-6 py-2 rounded-lg font-medium ${
                  selectedReason
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Chi tiết */}
        {step === 2 && (
          <div className="p-4">
            <div className="mb-4">
              <p className="font-medium mb-2">
                Lý do:{" "}
                {REPORT_REASONS.find((r) => r.value === selectedReason)?.label}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Thông tin bổ sung (tùy chọn)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows="3"
                placeholder="Mô tả chi tiết vấn đề..."
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Thành công */}
        {step === 3 && (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Cảm ơn bạn đã báo cáo
            </h3>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã nhận được báo cáo của bạn và sẽ xem xét trong thời
              gian sớm nhất.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
