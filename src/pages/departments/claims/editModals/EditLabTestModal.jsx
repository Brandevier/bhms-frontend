import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EditLabTestModal = ({ item, visible, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item && visible) {
      form.setFieldsValue({
        description: item.description,
        gdrg_code: item.gdrg_code,
        quantity: item.quantity,
        nhia_amount: item.nhia_amount,
        date_performed: item.date_performed ? moment(item.date_performed) : null,
        // Lab Test fields
        test_type: item.labTest?.test_type,
        result_value: item.labTest?.result_value,
        result_unit: item.labTest?.result_unit,
        reference_range: item.labTest?.reference_range,
        status: item.labTest?.status,
        notes: item.labTest?.notes
      });
    }
  }, [item, visible, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const updatedItem = {
        ...item,
        ...values,
        labTest: item.labTest ? {
          ...item.labTest,
          test_type: values.test_type,
          result_value: values.result_value,
          result_unit: values.result_unit,
          reference_range: values.reference_range,
          status: values.status,
          notes: values.notes
        } : null
      };

      onSave(updatedItem);
      message.success('Lab test item updated successfully');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Lab Test Item"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="gdrg_code" label="GDRG Code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="nhia_amount" label="NHIA Amount" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="date_performed" label="Date Performed">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Lab Test Details */}
        <Form.Item name="test_type" label="Test Type">
          <Select>
            <Option value="blood">Blood Test</Option>
            <Option value="urine">Urine Test</Option>
            <Option value="imaging">Imaging</Option>
            <Option value="biopsy">Biopsy</Option>
            <Option value="culture">Culture</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="result_value" label="Result Value">
          <Input />
        </Form.Item>
        
        <Form.Item name="result_unit" label="Result Unit">
          <Input placeholder="e.g., mg/dL, mmol/L" />
        </Form.Item>
        
        <Form.Item name="reference_range" label="Reference Range">
          <Input placeholder="e.g., 0-100 mg/dL" />
        </Form.Item>
        
        <Form.Item name="status" label="Status">
          <Select>
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
            <Option value="abnormal">Abnormal</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="notes" label="Lab Notes">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLabTestModal;