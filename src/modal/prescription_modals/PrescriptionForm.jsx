import React from 'react';
import { Form, Input, Select, Row, Col, InputNumber } from 'antd';
// import { getFrequencyOptions, getFrequencyOptionsByCategory } from '../../utils/pharmacyAbbreviations';
import { getFrequencyOptions,getFrequencyOptionsByCategory } from './pharmacyAbbreviations';


const { TextArea } = Input;

const PrescriptionForm = ({ 
  form, 
  selectedDrug, 
  onValuesChange 
}) => {
  // Option 1: Simple flat list
  // const frequencyOptions = getFrequencyOptions();

  // Option 2: Grouped by category (recommended for better UX)
  const frequencyCategories = getFrequencyOptionsByCategory();
  
  // Convert categories to Select options with OptGroup
  const groupedFrequencyOptions = Object.keys(frequencyCategories).map(category => ({
    label: category,
    options: frequencyCategories[category]
  }));

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
              options={groupedFrequencyOptions}
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) => {
                if (option.options) {
                  return option.options.some(
                    opt => opt.label.toLowerCase().includes(input.toLowerCase()) ||
                          opt.value.toLowerCase().includes(input.toLowerCase())
                  );
                }
                return option.label.toLowerCase().includes(input.toLowerCase()) ||
                       option.value.toLowerCase().includes(input.toLowerCase());
              }}
              optionFilterProp="children"
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

      {/* Optional: Route of Administration */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item 
            name="route" 
            label="Route of Administration"
          >
            <Select 
              placeholder="Select route (optional)"
              options={[
                { value: 'PO', label: 'PO - By mouth (Oral)' },
                { value: 'SC', label: 'SC - Subcutaneous' },
                { value: 'IM', label: 'IM - Intramuscular' },
                { value: 'IV', label: 'IV - Intravenous' },
                { value: 'SL', label: 'SL - Sublingual' },
                { value: 'TOP', label: 'TOP - Topical' },
                { value: 'INH', label: 'INH - Inhalation' },
              ]}
              style={{ width: '100%' }}
              allowClear
            />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item 
            name="quantity" 
            label="Quantity"
          >
            <InputNumber 
              min={1}
              placeholder="Total quantity"
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