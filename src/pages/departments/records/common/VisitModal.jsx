import React from "react";
import { Modal, Form, Select, Button } from "antd";

const { Option } = Select;

const VisitModal = ({ visible, onCancel, onSubmit, departments }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Initiate Visit"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Start Visit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Department selection (from props) */}
        <Form.Item
          name="department_id"
          label="Department"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select placeholder="Select department">
            {departments?.map((dept) => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Visit Type */}
        <Form.Item
          name="visit_type"
          label="Visit Type"
          rules={[{ required: true, message: "Please select visit type" }]}
        >
          <Select placeholder="Select visit type">
            <Option value="General OPD">General OPD</Option>
            <Option value="Maternity">Maternity</Option>
          </Select>
        </Form.Item>

        {/* Attendance Type */}
        <Form.Item
          name="attendance_type"
          label="Attendance Type"
          rules={[{ required: true, message: "Please select attendance type" }]}
        >
          <Select placeholder="Select attendance type">
            <Option value="New">New</Option>
            <Option value="Follow-up">Follow-up</Option>
            <Option value="Emergency">Emergency</Option>
            <Option value="Referral">Referral</Option>
            <Option value="Transfer">Transfer</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VisitModal;
