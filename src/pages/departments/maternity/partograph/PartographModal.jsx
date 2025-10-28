// components/maternity/PartographModal.js
import React from "react";
import { Modal, Form, InputNumber, Button } from "antd";

const PartographModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Add Partograph Record"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="cervical_dilatation"
          label="Cervical Dilatation (cm)"
          rules={[{ required: true, message: "Enter cervical dilatation" }]}
        >
          <InputNumber min={0} max={10} step={0.5} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="fetal_heart_rate" label="Fetal Heart Rate">
          <InputNumber min={60} max={200} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="contractions" label="Contractions (per 10 mins)">
          <InputNumber min={0} max={10} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="maternal_pulse" label="Maternal Pulse">
          <InputNumber min={30} max={200} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PartographModal;
