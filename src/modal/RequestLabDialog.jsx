import React, { useState } from "react";
import { Modal, Form, Select, Input, Spin } from "antd";
import BhmsButton from "../heroComponents/BhmsButton";

const { Option } = Select;
const { TextArea } = Input;

const RequestLabDialog = ({ visible, tests, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [selectedTest, setSelectedTest] = useState(null);
  
  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Request Lab Test"
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton key="cancel" block={false} outline onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="submit" block={false} type="primary" onClick={() => form.submit()}>
          {loading ? <Spin /> : "Request"}
        </BhmsButton>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Lab Test Selection */}
        <Form.Item
          name="test_id"
          label="Search & Select Lab Test"
          rules={[{ required: true, message: "Please select a lab test" }]}
        >
          <Select
            showSearch
            placeholder="Type to search lab tests"
            onChange={setSelectedTest}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tests?.map((test) => (
              <Option key={test.id} value={test.id}>
                {test.test_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Additional Comments */}
        <Form.Item name="comment" label="Additional Comments">
          <TextArea rows={4} placeholder="Enter any additional details..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestLabDialog;
