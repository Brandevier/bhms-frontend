import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EditDiagnosisModal = ({ item, visible, onSave, onCancel }) => {
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
        // Diagnosis fields
        icd_10_code: item.diagnosis?.icd_10_code,
        severity: item.diagnosis?.severity,
        type: item.diagnosis?.type,
        status: item.diagnosis?.status,
        notes: item.diagnosis?.notes
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
        diagnosis: item.diagnosis ? {
          ...item.diagnosis,
          icd_10_code: values.icd_10_code,
          severity: values.severity,
          type: values.type,
          status: values.status,
          notes: values.notes
        } : null
      };

      onSave(updatedItem);
      message.success('Diagnosis item updated successfully');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Diagnosis Item"
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

        {/* Diagnosis Details */}
        <Form.Item name="icd_10_code" label="ICD-10 Code">
          <Input placeholder="e.g., J45.909" />
        </Form.Item>
        
        <Form.Item name="severity" label="Severity">
          <Select>
            <Option value="mild">Mild</Option>
            <Option value="moderate">Moderate</Option>
            <Option value="severe">Severe</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="type" label="Diagnosis Type">
          <Select>
            <Option value="primary">Primary</Option>
            <Option value="secondary">Secondary</Option>
            <Option value="differential">Differential</Option>
            <Option value="provisional">Provisional</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="status" label="Status">
          <Select>
            <Option value="active">Active</Option>
            <Option value="resolved">Resolved</Option>
            <Option value="chronic">Chronic</Option>
            <Option value="ruled_out">Ruled Out</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="notes" label="Clinical Notes">
          <TextArea rows={3} placeholder="Additional clinical notes and observations" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDiagnosisModal;