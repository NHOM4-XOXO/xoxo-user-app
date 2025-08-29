"use client";

import React from "react";
import { Modal } from "antd";

export default function NotifyModal({ notifyModal, setNotifyModal }) {
    return (
        <Modal
            open={notifyModal.open}
            footer={null}
            onCancel={() => setNotifyModal({ ...notifyModal, open: false })}
            centered
            closable={false}
            width={400}
            className={`custom-notify-modal ${notifyModal.type === "success" ? "bg-green-50" : "bg-red-50"}`}
        >
            <div className="flex flex-col items-center p-4">
                <h3
                    className={`text-lg font-bold mb-2 ${notifyModal.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {notifyModal.title}
                </h3>
            </div>
        </Modal>
    );
}
