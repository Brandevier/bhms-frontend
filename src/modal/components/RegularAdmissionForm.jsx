import React, { useState, useEffect } from "react";
import { Form, Select, Input, Tag } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;
const { TextArea } = Input;

const RegularAdmissionForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const { departments } = useSelector((state) => state.departments);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Get only departments that are "Ward"
  const wardDepartments = departments?.filter((dept) => 
    dept.departmentType === "Ward" || dept.departmentType === "Surgery"
  ) || [];

  // Find beds for selected department
  const selectedBeds = selectedDepartment ? selectedDepartment.bed : [];

  // Handle Department Change
  const handleDepartmentChange = (deptId) => {
    const department = wardDepartments.find((dept) => dept.id === deptId);
    setSelectedDepartment(department || null);
    form.setFieldsValue({ bed_id: undefined });
  };

  // Listen for submit event from parent
  useEffect(() => {
    const handleSubmit = () => {
      form.submit();
    };

    document.addEventListener('submitForm', handleSubmit);
    return () => {
      document.removeEventListener('submitForm', handleSubmit);
    };
  }, [form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
    setSelectedDepartment(null);
    console.log(values)
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      {/* Select Department */}
      <Form.Item 
        label="Select Ward" 
        name="department_id" 
        rules={[{ required: true, message: "Please select a ward" }]}
      >
        <Select placeholder="Choose ward" onChange={handleDepartmentChange}>
          {wardDepartments.map((dept) => (
            <Option key={dept.id} value={dept.id}>
              {dept.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Select Bed Number */}
      {selectedDepartment && (
        <Form.Item 
          label="Bed Number" 
          name="bed_id" 
          rules={[{ required: true, message: "Please select a bed" }]}
        >
          <Select placeholder="Choose bed number">
            {selectedBeds.map((bed) => (
              <Option key={bed.id} value={bed.id} disabled={bed.is_occupied}>
                {bed.bed_number} -{" "}
                {bed.is_occupied ? (
                  <Tag color="red">Occupied</Tag>
                ) : (
                  <Tag color="green">Available</Tag>
                )}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {/* Description */}
      <Form.Item label="Admission Notes" name="note">
        <TextArea rows={3} placeholder="Enter admission notes, condition, or special instructions..." />
      </Form.Item>

      {/* Emergency Checkbox */}
      <Form.Item name="is_emergency" valuePropName="checked" initialValue={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="emergency"
            onChange={(e) => form.setFieldsValue({ is_emergency: e.target.checked })}
          />
          <label htmlFor="emergency" style={{ color: '#ff4d4f', fontWeight: '500' }}>
            Mark as Emergency Admission
          </label>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RegularAdmissionForm;