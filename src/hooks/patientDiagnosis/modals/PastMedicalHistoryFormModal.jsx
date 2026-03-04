import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const PastMedicalHistoryFormModal = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  loading
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        diagnosis_date: initialValues.diagnosis_date
          ? dayjs(initialValues.diagnosis_date)
          : null
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();

    onSubmit({
      ...values,
      diagnosis_date: values.diagnosis_date?.format('YYYY-MM-DD')
    });
  };

  return (
    <Modal
      title={initialValues ? "Edit Past Medical History" : "Add Past Medical History"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="condition"
          label="Medical Condition"
          rules={[{ required: true, message: "Medical condition is required" }]}
        >
          <Input placeholder="e.g., Hypertension, Diabetes, Asthma" />
        </Form.Item>

        <Form.Item
          name="diagnosis_date"
          label="Diagnosis Date"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Status is required" }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="controlled">Controlled</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="treatment"
          label="Treatment"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="e.g., Amlodipine 5mg daily, Metformin 500mg BD" 
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Additional notes about the condition..." 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PastMedicalHistoryFormModal;

