import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EditProcedureModal = ({ item, visible, onSave, onCancel }) => {
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
        // Procedure fields
        procedure_type: item.procedure?.type,
        duration: item.procedure?.duration,
        complexity: item.procedure?.complexity,
        notes: item.procedure?.notes
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
        procedure: item.procedure ? {
          ...item.procedure,
          type: values.procedure_type,
          duration: values.duration,
          complexity: values.complexity,
          notes: values.notes
        } : null
      };

      onSave(updatedItem);
      message.success('Procedure item updated successfully');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Procedure Item"
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

        {/* Procedure Details */}
        <Form.Item name="procedure_type" label="Procedure Type">
          <Select>
            <Option value="surgical">Surgical</Option>
            <Option value="diagnostic">Diagnostic</Option>
            <Option value="therapeutic">Therapeutic</Option>
            <Option value="cosmetic">Cosmetic</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="duration" label="Duration (minutes)">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="complexity" label="Complexity">
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="notes" label="Procedure Notes">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProcedureModal;