import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const GDRGModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  form,
  editingCode,
}) => {
  return (
    <Modal
      title={editingCode ? 'Edit GDRG Code' : 'Create New GDRG Code'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: 'Please input the code!' }]}
        >
          <Input disabled={!!editingCode} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="condition"
          label="Condition"
          rules={[{ required: true, message: 'Please input the condition!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select the category!' }]}
        >
          <Select>
            <Option value="Diagnosis">Diagnosis</Option>
            <Option value="Procedure">Procedure</Option>
            <Option value="Medication">Medication</Option>
            <Option value="Service">Service</Option>
            <Option value="ENT">ENT</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="market_price"
          label="Market Price (GHS)"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            formatter={(value) => `GHS ${value}`}
            parser={(value) => value.replace(/GHS\s?/, '')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="nhia_price"
          label="NHIA Price (GHS)"
          rules={[{ required: true, message: 'Please input the NHIA price!' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            formatter={(value) => `GHS ${value}`}
            parser={(value) => value.replace(/GHS\s?/, '')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="is_nhia_covered"
          label="NHIA Covered"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="coverage_percentage"
          label="Coverage Percentage"
          rules={[{ required: true, message: 'Please input coverage percentage!' }]}
        >
          <InputNumber
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GDRGModal;