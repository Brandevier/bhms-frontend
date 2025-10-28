import React, { useEffect } from "react";
import { Form, Select, Input, Checkbox, Divider, Alert } from "antd";
import { useSelector } from "react-redux";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const TransferDepartmentForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const { departments } = useSelector((state) => state.departments);

  // Get all departments except current one (you might need to pass current department as prop)
  const availableDepartments = departments?.filter(dept => 
    dept.departmentType !== "Theatre" // Exclude theatres for transfers
  ) || [];

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
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Alert
        message="Department Transfer"
        description="Transfer patient to another department within the hospital"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 16 }}
      />

      {/* Current Department (read-only) */}
      <Form.Item label="Current Department" name="current_department">
        <Input 
          placeholder="Automatically detected" 
          disabled 
          value="Emergency Department" // This should come from props
        />
      </Form.Item>

      {/* Transfer To Department */}
      <Form.Item 
        label="Transfer To Department" 
        name="target_department_id"
        rules={[{ required: true, message: "Please select target department" }]}
      >
        <Select placeholder="Select department to transfer to">
          {availableDepartments.map((dept) => (
            <Option key={dept.id} value={dept.id}>
              {dept.name} ({dept.departmentType})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left">Transfer Details</Divider>

      {/* Reason for Transfer */}
      <Form.Item 
        label="Reason for Transfer" 
        name="transfer_reason"
        rules={[{ required: true, message: "Please provide transfer reason" }]}
      >
        <Select placeholder="Select reason for transfer">
          <Option value="specialist_care">Specialist Care Required</Option>
          <Option value="bed_availability">Bed Availability</Option>
          <Option value="patient_condition">Change in Patient Condition</Option>
          <Option value="procedure_required">Specific Procedure Required</Option>
          <Option value="consultation">Consultation</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      {/* Additional Notes */}
      <Form.Item label="Transfer Notes" name="transfer_notes">
        <TextArea 
          rows={3} 
          placeholder="Provide detailed notes about the transfer, patient condition, and any special requirements..." 
        />
      </Form.Item>

      {/* Emergency Transfer */}
      <Form.Item name="is_emergency_transfer" valuePropName="checked" initialValue={false}>
        <Checkbox>
          <span style={{ color: '#ff4d4f', fontWeight: '500' }}>
            Emergency Transfer (Immediate attention required)
          </span>
        </Checkbox>
      </Form.Item>

      {/* Urgency Level */}
      <Form.Item label="Transfer Urgency" name="urgency_level">
        <Select placeholder="Select urgency level">
          <Option value="routine">Routine (Within 24 hours)</Option>
          <Option value="urgent">Urgent (Within 4 hours)</Option>
          <Option value="emergency">Emergency (Immediate)</Option>
        </Select>
      </Form.Item>

      {/* Additional Information */}
      <Form.Item label="Additional Information" name="additional_info">
        <TextArea 
          rows={2} 
          placeholder="Any additional information for the receiving department..." 
        />
      </Form.Item>
    </Form>
  );
};

export default TransferDepartmentForm;