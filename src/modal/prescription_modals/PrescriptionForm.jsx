import React from 'react';
import { Form, Input, Select, Row, Col, InputNumber } from 'antd';

const { TextArea } = Input;

const PrescriptionForm = ({ 
  form, 
  selectedDrug, 
  onValuesChange 
}) => {
  const frequencyOptions = [
    { value: 'once', label: 'Once daily' },
    { value: 'twice', label: 'Twice daily' },
    { value: 'three_times', label: 'Three times daily' },
    { value: 'four_times', label: 'Four times daily' },
    { value: 'every_four_hours', label: 'Every 4 hours' },
    { value: 'every_six_hours', label: 'Every 6 hours' },
    { value: 'every_eight_hours', label: 'Every 8 hours' },
    { value: 'every_twelve_hours', label: 'Every 12 hours' },
    { value: 'as_needed', label: 'As needed' },
    { value: 'bedtime', label: 'At bedtime' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      className="space-y-4"
    >
      {/* Main Prescription Details - Single Row */}
      <Row gutter={16} align="bottom">
        <Col span={8}>
          <Form.Item 
            name="dosage" 
            label="Dose"
            rules={[{ required: true, message: 'Please enter dosage' }]}
          >
            <Input 
              placeholder="e.g., 250mg, 1 tablet, 5ml"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item 
            name="frequency" 
            label="Frequency"
            rules={[{ required: true, message: 'Please select frequency' }]}
          >
            <Select 
              placeholder="Select frequency" 
              options={frequencyOptions}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item 
            name="duration" 
            label="Duration (days)"
            rules={[{ required: true, message: 'Please enter duration' }]}
          >
            <InputNumber 
              min={1}
              max={365}
              placeholder="e.g., 5, 7, 10"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Instructions */}
      <Form.Item name="notes" label="Instructions">
        <TextArea 
          rows={3} 
          placeholder="Special instructions, administration notes, or additional guidance..."
          maxLength={500}
          showCount
        />
      </Form.Item>
    </Form>
  );
};

export default PrescriptionForm;