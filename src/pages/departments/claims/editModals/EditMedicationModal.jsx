import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EditMedicationModal = ({ item, visible, onSave, onCancel }) => {
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
        // Prescription fields
        dosage: item.prescription?.dosage,
        frequency: item.prescription?.frequency,
        duration: item.prescription?.duration,
        route: item.prescription?.route,
        notes: item.prescription?.notes
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
        prescription: item.prescription ? {
          ...item.prescription,
          dosage: values.dosage,
          frequency: values.frequency,
          duration: values.duration,
          route: values.route,
          notes: values.notes
        } : null
      };

      onSave(updatedItem);
      message.success('Medication item updated successfully');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Medication Item"
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

        {/* Prescription Details */}
        <Form.Item name="dosage" label="Dosage">
          <Input />
        </Form.Item>
        
        <Form.Item name="frequency" label="Frequency (per day)">
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="duration" label="Duration (days)">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item name="route" label="Route">
          <Select>
            <Option value="oral">Oral</Option>
            <Option value="injection">Injection</Option>
            <Option value="topical">Topical</Option>
            <Option value="inhalation">Inhalation</Option>
          </Select>
        </Form.Item>
        
        <Form.Item name="notes" label="Notes">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMedicationModal;