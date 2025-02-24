import React, { useState } from "react";
import { Modal, Form, Select, Checkbox, message, Spin, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { registerStaff } from "../../../redux/slice/staff_admin_managment_slice";
import PhoneInput from "react-phone-input-2";

const { Option } = Select;

const AddStaffDialog = ({ visible, onClose, updateComponent }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Get roles and departments from Redux store
    const { roles, loading: rolesLoading } = useSelector((state) => state.permissions);
    const { departments, loading: deptLoading } = useSelector((state) => state.departments);
    const { register_staff_loading } = useSelector((state) => state.adminStaffManagement);

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                dispatch(registerStaff(values))
                    .unwrap()
                    .then(() => {
                        message.success("Staff added successfully!");
                        form.resetFields();
                        updateComponent();
                        onClose();
                    })
                    .catch((err) => {
                        message.error(err?.message || "Failed to add staff!");
                    });
                console.log(values);
            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
            });
    };

    return (
        <Modal
            title="Add New Staff"
            open={visible}
            onCancel={onClose}
            footer={[
                <BhmsButton key="cancel" block={false} size="medium" outline onClick={onClose}>
                    Cancel
                </BhmsButton>,
                <BhmsButton key="submit" type="primary" size="medium" onClick={handleSubmit} block={false}>
                    {register_staff_loading ? <Spin /> : "Add Staff"}
                </BhmsButton>,
            ]}
        >
            <Form form={form} layout="vertical" initialValues={{ password: "pa$$w0rd" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <Form.Item name="firstName" rules={[{ required: true, message: "First name is required" }]}>
                        <Input placeholder="Enter first name" />
                    </Form.Item>

                    <Form.Item name="middlename">
                        <Input placeholder="Enter middle name" />
                    </Form.Item>

                    <Form.Item name="lastName" rules={[{ required: true, message: "Last name is required" }]}>
                        <Input placeholder="Enter last name" />
                    </Form.Item>

                    <Form.Item name="email" rules={[{ type: "email", message: "Enter a valid email" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>

                    {/* Phone Input */}
                    <Form.Item name="phoneNumber" rules={[{ required: true, message: "Phone number is required" }]}>
                        <PhoneInput
                            country={"gh"}
                            enableSearch={true}
                            inputStyle={{ width: "100%" }}
                            containerStyle={{ width: "100%" }}
                            placeholder="Enter phone number"
                        />
                    </Form.Item>

                    {/* Password Input with View/Hide Toggle */}
                    <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
                        <Input.Password
                            placeholder="Enter password"
                            visibilityToggle={{
                                visible: passwordVisible,
                                onVisibleChange: setPasswordVisible,
                            }}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {/* Department Dropdown */}
                    <Form.Item name="department_id" label="Department" rules={[{ required: true, message: "Department is required" }]}>
                        <Select placeholder="Select department" loading={deptLoading}>
                            {departments?.map((dept) => (
                                <Option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Role Dropdown (Specialist) */}
                    <Form.Item name="role_id" label="Specialist" rules={[{ required: true, message: "Specialist is required" }]}>
                        <Select placeholder="Select specialist" loading={rolesLoading}>
                            {roles?.map((role) => (
                                <Option key={role.id} value={role.id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item name="is_incharge" valuePropName="checked" initialValue={false}>
                    <Checkbox>Incharge</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddStaffDialog;
