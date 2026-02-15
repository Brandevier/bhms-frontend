import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const DrugHistoryFormModal = ({
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
        start_date: initialValues.start_date
          ? dayjs(initialValues.start_date)
          : null,
        end_date: initialValues.end_date
          ? dayjs(initialValues.end_date)
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
      start_date: values.start_date?.toISOString(),
      end_date: values.end_date?.toISOString()
    });
  };

  return (
    <Modal
      title={initialValues ? "Edit Drug History" : "Add Drug History"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="drug_name"
          label="Drug Name"
          rules={[{ required: true, message: "Drug name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="dosage" label="Dosage">
          <Input />
        </Form.Item>

        <Form.Item name="frequency" label="Frequency">
          <Input />
        </Form.Item>

        <Form.Item name="route" label="Route">
          <Input />
        </Form.Item>

        <Form.Item name="indication" label="Indication">
          <Input />
        </Form.Item>

        <Form.Item name="start_date" label="Start Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="end_date" label="End Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DrugHistoryFormModal;
