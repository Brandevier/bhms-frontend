import React from "react";
import { Modal, Form, Select, Checkbox, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BhmsButton from "../../../heroComponents/BhmsButton";
import BhmsInput from "../../../heroComponents/BhmsInput";
import { registerStaff } from "../../../redux/slice/staff_admin_managment_slice";

const { Option } = Select;

const AddStaffDialog = ({ visible, onClose, updateComponent }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

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
                console.log(values)
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
                    <BhmsInput placeholder="Enter first name" required name="firstName" />
                    <BhmsInput placeholder="Enter middle name" name="middlename" />
                    <BhmsInput placeholder="Enter last name" required name="lastName" />
                    <BhmsInput type="email" placeholder="Enter email" name="email" />
                    <BhmsInput placeholder="Enter phone number" required name="phoneNumber" />
                    <BhmsInput placeholder="Enter password" required type="password" name="password" />

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
