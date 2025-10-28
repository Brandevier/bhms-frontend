import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

const FrequencyInput = ({ form }) => {
  return (
    <Form.Item
      label={<span style={{ fontWeight: 500 }}>Frequency</span>}
      name="frequency"
      rules={[{ required: true, message: 'Please enter frequency' }]}
    >
      <Select
        placeholder="Select frequency"
        style={{ width: '100%' }}
        size="large"
      >
        <Option value={1}>Once daily (OD)</Option>
        <Option value={2}>Twice daily (BD)</Option>
        <Option value={3}>Three times daily (TID)</Option>
        <Option value={4}>Four times daily (QID)</Option>
        <Option value="PRN">As needed (PRN)</Option>
      </Select>
    </Form.Item>
  );
};

export default FrequencyInput;