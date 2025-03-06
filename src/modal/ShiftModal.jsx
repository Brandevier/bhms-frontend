import React from "react";
import { Modal, Form, Select, Button } from "antd";

const { Option } = Select;

const shiftOptions = ["morning", "afternoon", "night", "off"];
const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const ShiftModal = ({ visible, onClose, onSubmit, staff }) => {
  const [form] = Form.useForm();

  // Handle form submission
  const handleFinish = (values) => {
    const shifts = Object.entries(values).map(([day, shift]) => ({
      staff_id: staff.id,
      day,
      shift,
    }));

    onSubmit(shifts);
    form.resetFields();
  };

  return (
    <Modal
      title={`Assign Shift - ${staff?.firstName} ${staff?.lastName}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {daysOfWeek.map((day) => (
          <Form.Item key={day} label={day.toUpperCase()} name={day}>
            <Select placeholder="Select shift">
              {shiftOptions.map((shift) => (
                <Option key={shift} value={shift}>
                  {shift}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ShiftModal;
