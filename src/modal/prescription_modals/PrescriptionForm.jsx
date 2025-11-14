import React from 'react';
import { Form, Input, Select, Row, Col, InputNumber } from 'antd';

const { TextArea } = Input;

const PrescriptionForm = ({ 
  form, 
  selectedDrug, 
  onValuesChange 
}) => {
  const frequencyOptions = [
  // Daily frequencies
  { value: 'OD', label: 'Once daily' },
  { value: 'BD', label: 'Twice daily' },
  { value: 'TDS', label: 'Three times daily' },
  { value: 'QID', label: 'Four times daily' },
  { value: 'QHS', label: 'At bedtime (once nightly)' },

  // Hourly intervals
  { value: 'Q4H', label: 'Every 4 hours' },
  { value: 'Q6H', label: 'Every 6 hours' },
  { value: 'Q8H', label: 'Every 8 hours' },
  { value: 'Q12H', label: 'Every 12 hours' },
  { value: 'Q1H', label: 'Every 1 hour' },
  { value: 'Q2H', label: 'Every 2 hours' },
  { value: 'Q3H', label: 'Every 3 hours' },

  // Meal-related
  { value: 'AC', label: 'Before meals' },
  { value: 'PC', label: 'After meals' },
  { value: 'BPC', label: 'Before and after meals' },

  // Weekly / Monthly
  { value: 'QW', label: 'Once weekly' },
  { value: 'QM', label: 'Once monthly' },

  // As-needed / conditional
  { value: 'PRN', label: 'As needed' },
  { value: 'STAT', label: 'Immediately' },

  // Special times
  { value: 'AM', label: 'Every morning' },
  { value: 'PM', label: 'Every evening' },
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