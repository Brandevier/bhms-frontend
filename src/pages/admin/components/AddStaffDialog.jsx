import React, { useState,useEffect } from "react";
import { Modal, Form, Select, Checkbox, message, Spin, Input, Row, Col, Card, Tag, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { registerStaff } from "../../../redux/slice/staff_admin_managment_slice";
import PhoneInput from "react-phone-input-2";
import { getAllRoles } from "../../../redux/slice/staffPermissionSlice";
const { Option } = Select;
const { Text } = Typography;

const AddStaffDialog = ({ visible, onClose, updateComponent }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [primaryDepartmentId, setPrimaryDepartmentId] = useState(null);

    // Get roles and departments from Redux store
    const { roles, loading: rolesLoading } = useSelector((state) => state.permissions);
    const { departments, loading: deptLoading } = useSelector((state) => state.departments);
    const { register_staff_loading } = useSelector((state) => state.adminStaffManagement);


    useEffect(() => {
        if (visible) {
            dispatch(getAllRoles());
        }
    }, [visible, dispatch]);

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                // Convert department array to the format expected by your API
                const submitData = {
                    ...values,
                    department_ids: values.department_ids || [], // Ensure it's an array
                    primary_department_id: values.primary_department_id // Include primary department
                };
                
                dispatch(registerStaff(submitData))
                    .unwrap()
                    .then(() => {
                        message.success("Staff member added successfully!");
                        form.resetFields();
                        setSelectedDepartments([]);
                        updateComponent();
                        onClose();
                    })
                    .catch((err) => {
                        message.error(err?.message || "Failed to add staff member!");
                    });
            })
            .catch((errorInfo) => {
                console.log("Validation Failed:", errorInfo);
            });
    };

    const handleDepartmentChange = (selectedValues) => {
        setSelectedDepartments(selectedValues);
        // Reset primary department if the selected departments change
        setPrimaryDepartmentId(null);
        form.setFieldValue('primary_department_id', undefined);
    };

    const handlePrimaryDepartmentChange = (value) => {
        setPrimaryDepartmentId(value);
    };

    const handleClose = () => {
        form.resetFields();
        setSelectedDepartments([]);
        setPrimaryDepartmentId(null);
        onClose();
    };

    // Filter selected departments for display
    const selectedDepartmentDetails = selectedDepartments.map(deptId => 
        departments?.find(dept => dept.id === deptId)
    ).filter(Boolean);

    // Get department options for primary department dropdown (only from selected departments)
    const primaryDepartmentOptions = selectedDepartments.map(deptId => {
        const dept = departments?.find(d => d.id === deptId);
        return dept ? { id: dept.id, name: dept.name, departmentType: dept.departmentType } : null;
    }).filter(Boolean);

    return (
        <Modal
            title={
                <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Add New Staff Member</div>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        Create a new staff account with appropriate department access
                    </Text>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            width={800}
            footer={[
                <BhmsButton key="cancel" block={false} size="medium" outline onClick={handleClose}>
                    Cancel
                </BhmsButton>,
                <BhmsButton 
                    key="submit" 
                    type="primary" 
                    size="medium" 
                    onClick={handleSubmit} 
                    block={false}
                    loading={register_staff_loading}
                >
                    {register_staff_loading ? "Adding Staff..." : "Add Staff Member"}
                </BhmsButton>,
            ]}
        >
            <Form 
                form={form} 
                layout="vertical" 
                initialValues={{ 
                    password: "pa$$w0rd",
                    department_ids: []
                }}
            >
                <Card 
                    title="Personal Information" 
                    size="small" 
                    style={{ marginBottom: '16px' }}
                    extra={
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    }
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Form.Item 
                                name="firstName" 
                                label={
                                    <span>
                                        First Name <Text type="danger">*</Text>
                                    </span>
                                }
                                rules={[{ 
                                    required: true, 
                                    message: "First name is required" 
                                }]}
                                tooltip="Staff member's legal first name"
                            >
                                <Input 
                                    placeholder="Enter first name" 
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item 
                                name="middlename" 
                                label="Middle Name"
                                tooltip="Optional middle name or initial"
                            >
                                <Input 
                                    placeholder="Enter middle name" 
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item 
                                name="lastName" 
                                label={
                                    <span>
                                        Last Name <Text type="danger">*</Text>
                                    </span>
                                }
                                rules={[{ 
                                    required: true, 
                                    message: "Last name is required" 
                                }]}
                                tooltip="Staff member's legal last name"
                            >
                                <Input 
                                    placeholder="Enter last name" 
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="email" 
                                label="Email Address"
                                rules={[{ 
                                    type: "email", 
                                    message: "Please enter a valid email address" 
                                }]}
                                tooltip="Professional email address for communications"
                            >
                                <Input 
                                    placeholder="name@hospital.org" 
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="phoneNumber" 
                                label={
                                    <span>
                                        Phone Number <Text type="danger">*</Text>
                                    </span>
                                }
                                rules={[{ 
                                    required: true, 
                                    message: "Phone number is required for emergency contact" 
                                }]}
                                tooltip="Primary contact number with country code"
                            >
                                <PhoneInput
                                    country={"gh"}
                                    enableSearch={true}
                                    inputStyle={{ 
                                        width: "100%", 
                                        height: "40px",
                                        fontSize: "14px"
                                    }}
                                    containerStyle={{ width: "100%" }}
                                    placeholder="+233 XX XXX XXXX"
                                    dropdownStyle={{ zIndex: 9999 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card 
                    title="Account & Access Settings" 
                    size="small" 
                    style={{ marginBottom: '16px' }}
                    extra={
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    }
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="password" 
                                label={
                                    <span>
                                        Password <Text type="danger">*</Text>
                                    </span>
                                }
                                rules={[{ 
                                    required: true, 
                                    message: "Password is required for account access",
                                    min: 6,
                                }]}
                                tooltip="Default password for initial login. User will be prompted to change it."
                            >
                                <Input.Password
                                    placeholder="Enter secure password"
                                    size="large"
                                    visibilityToggle={{
                                        visible: passwordVisible,
                                        onVisibleChange: setPasswordVisible,
                                    }}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item 
                                name="role_id" 
                                label={
                                    <span>
                                        Staff Role <Text type="danger">*</Text>
                                    </span>
                                }
                                rules={[{ 
                                    required: true, 
                                    message: "Please select a staff role" 
                                }]}
                                tooltip="Primary role determines system permissions and access levels"
                            >
                                <Select 
                                    placeholder="Select staff role" 
                                    loading={rolesLoading}
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {roles?.map((role) => (
                                        <Option key={role.id} value={role.id}>
                                            {role.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card 
                    title="Department Access" 
                    size="small"
                    extra={
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    }
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Form.Item 
                                name="department_ids" 
                                label={
                                    <span>
                                        Assigned Departments <Text type="danger">*</Text>
                                    </span>
                                }
                                rules={[{ 
                                    required: true, 
                                    type: 'array',
                                    min: 1,
                                    message: "Please select at least one department"
                                }]}
                                tooltip="Select all departments this staff member should have access to"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select departments"
                                    loading={deptLoading}
                                    size="large"
                                    onChange={handleDepartmentChange}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    style={{ width: '100%' }}
                                >
                                    {departments?.map((dept) => (
                                        <Option key={dept.id} value={dept.id}>
                                            {dept.name} {dept.departmentType && `(${dept.departmentType})`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Primary Department Selection */}
                    {selectedDepartments.length > 0 && (
                        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                            <Col xs={24}>
                                <Form.Item 
                                    name="primary_department_id" 
                                    label={
                                        <span>
                                            Primary Department <Text type="danger">*</Text>
                                        </span>
                                    }
                                    rules={[{ 
                                        required: true, 
                                        message: "Please select a primary department"
                                    }]}
                                    tooltip="The main department where this staff member works"
                                >
                                    <Select
                                        placeholder="Select primary department"
                                        size="large"
                                        onChange={handlePrimaryDepartmentChange}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        style={{ width: '100%' }}
                                    >
                                        {primaryDepartmentOptions.map((dept) => (
                                            <Option key={dept.id} value={dept.id}>
                                                {dept.name} {dept.departmentType && `(${dept.departmentType})`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* Selected Departments Preview */}
                    {selectedDepartmentDetails.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                            <Text strong>Selected Departments:</Text>
                            <div style={{ marginTop: '8px' }}>
                                {selectedDepartmentDetails.map((dept, index) => (
                                    <Tag 
                                        key={dept.id} 
                                        color={dept.id === primaryDepartmentId ? "green" : "blue"}
                                        style={{ marginBottom: '4px', padding: '4px 8px' }}
                                    >
                                        {dept.name}
                                        {dept.departmentType && (
                                            <Text type="secondary" style={{ fontSize: '12px', marginLeft: '4px' }}>
                                                ({dept.departmentType})
                                            </Text>
                                        )}
                                        {dept.id === primaryDepartmentId && (
                                            <Text style={{ fontSize: '12px', marginLeft: '4px', fontWeight: 'bold' }}>
                                                (Primary)
                                            </Text>
                                        )}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}

                    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                        <Col xs={24}>
                            <Form.Item 
                                name="is_incharge" 
                                valuePropName="checked" 
                                initialValue={false}
                                tooltip="Grant department in-charge privileges with administrative access"
                            >
                                <Checkbox>
                                    <Text strong>Assign as Department In-Charge</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Grants administrative privileges for assigned departments
                                    </Text>
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Form Guidelines */}
                <Card size="small" style={{ marginTop: '16px', background: '#f0f8ff' }}>
                    <Text type="secondary">
                        <InfoCircleOutlined style={{ marginRight: '8px' }} />
                        Required fields are marked with <Text type="danger">*</Text>. 
                        Staff members will receive login credentials and can access all assigned departments.
                    </Text>
                </Card>
            </Form>
        </Modal>
    );
};

export default AddStaffDialog;