// ConfirmModal.jsx
"use client";
import React from "react";

const ConfirmModal = ({ isOpen, title, content, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-fb-dark-secondary p-6 rounded-lg w-80">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{content}</p>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-1 rounded bg-gray-300 text-gray-800"
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-3 py-1 rounded bg-red-500 text-white"
                        onClick={onConfirm}
                    >
                        Hủy kết bạn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
