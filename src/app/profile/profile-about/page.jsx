"use client";

import {
    CalendarDays,
    User,
} from "lucide-react";
import BoxInfo from "@/components/main/Post/BoxInfo";
import { useState, useMemo, useEffect } from "react";
import {
    useGetMyProfileQuery,
    useUpdateProfileMutation,
} from "@/features/userApi";
import { Modal, Form, Input, DatePicker, Button, Select } from "antd";
import dayjs from "dayjs";

// cấu hình các field
const fieldsConfig = [
    { label: "Tổng quan", field: "bio", icon: null, type: "textarea" },
    {
        label: "Ngày sinh",
        field: "dateOfBirth",
        icon: <CalendarDays className="w-4 h-4" />,
        type: "date",
    },
    {
        label: "Giới tính",
        field: "gender",
        icon: <User className="w-4 h-4" />,
        type: "select",
        options: [
            { value: "MALE", label: "Nam" },
            { value: "FEMALE", label: "Nữ" },
            { value: "OTHER", label: "Khác" },
        ],
    },
];

export default function ProfileAbout() {
    const { data: profile, isLoading, isError, refetch } = useGetMyProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const mappedInfo = useMemo(() => {
        if (!profile) return [];
        return fieldsConfig.map(({ label, field, icon }) => ({
            label,
            icon,
            value: profile[field] || "",
        }));
    }, [profile]);

    // CHÚ Ý: chỉ set/reset form khi modal mở để tránh setFieldsValue lúc form chưa mount
    useEffect(() => {
        if (isModalOpen) {
            // đặt giá trị khi mở modal
            form.resetFields();
            if (profile) {
                form.setFieldsValue({
                    ...profile,
                    dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
                });
            }
        }
        // khi đóng modal không gọi setFieldsValue
    }, [isModalOpen, profile, form]);

    const openModal = () => setIsModalOpen(true);

    const handleCancel = () => {
        // reset khi đóng để form sạch lần mở sau
        try {
            form.resetFields();
        } catch (e) {
            // ignore
        }
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (values.dateOfBirth) {
                values.dateOfBirth = values.dateOfBirth.format("YYYY-MM-DD");
            }

            const payload = {
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                ...values,
            };

            await updateProfile(payload).unwrap();
            // đóng modal, reset form, refetch profile
            form.resetFields();
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            console.error("Lỗi khi update profile:", error);
        }
    };

    if (isLoading) return <p>Đang tải...</p>;
    if (isError) return <p>Lỗi khi tải thông tin</p>;

    return (
        <section className="rounded-lg bg-fb-light-primary dark:bg-fb-dark-secondary p-4 space-y-5 shadow-sm dark:border dark:border-fb-dark-quaternary">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thông tin cá nhân
                </h2>
                <Button type="primary" onClick={openModal}>
                    Chỉnh sửa
                </Button>
            </div>

            {/* Danh sách info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mappedInfo.map(({ icon, label, value }, index) => (
                    <div
                        key={index}
                        className={label === "Tổng quan" ? "md:col-span-2" : "h-full"}
                    >
                        <BoxInfo icon={icon} label={label} value={value || "Chưa cập nhật"} />
                    </div>
                ))}
            </div>

            {/* Modal Edit */}
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText="Lưu"
                cancelText="Hủy"
                confirmLoading={isUpdating}
                // destroyOnHidden thay cho destroyOnClose (không còn deprecated warning)
                destroyOnHidden
            >
                {/* form={form} bắt buộc để nối instance */}
                <Form form={form} layout="vertical" name="profileForm">
                    {fieldsConfig.map((field) => (
                        <Form.Item key={field.field} name={field.field} label={field.label}>
                            {field.type === "textarea" ? (
                                <Input.TextArea rows={3} />
                            ) : field.type === "date" ? (
                                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                            ) : field.type === "select" ? (
                                <Select
                                    options={field.options.map((o) => ({
                                        label: o.label,
                                        value: o.value,
                                    }))}
                                />
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
        </section>
    );
}
