import React from 'react';
import {
  Card,
  Form,
  InputNumber,
  Input,
  Space,
  Typography,
  Tag,
  Row,
  Col,
} from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';

const { Text } = Typography;

const BulkPrescriptionForm = ({ prescription, index, form, disabled }) => {
  const formName = `prescription_${prescription.id}`;

  return (
    <Card 
      size="small" 
      className="border-l-4 border-l-blue-500 hover:shadow-sm transition-shadow"
      title={
        <Space>
          <MedicineBoxOutlined className="text-blue-500" />
          <span>Prescription #{index}: {prescription.medicine?.generic_name}</span>
        </Space>
      }
      extra={<Tag color="orange">Pending</Tag>}
    >
      <Row gutter={16}>
        <Col span={12}>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <Text type="secondary">Dosage:</Text>
              <Text strong>{prescription.dosage}</Text>
            </div>
            <div className="flex justify-between text-sm">
              <Text type="secondary">Frequency:</Text>
              <Text strong>{prescription.frequency}</Text>
            </div>
            <div className="flex justify-between text-sm">
              <Text type="secondary">Duration:</Text>
              <Text strong>{prescription.duration} days</Text>
            </div>
          </div>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name={[formName, 'dispensedQuantity']}
            label="Dispensed Quantity *"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 1, message: 'Minimum 1' }
            ]}
            initialValue={prescription.quantity || 1}
          >
            <InputNumber 
              min={1}
              className="w-full"
              disabled={disabled}
              placeholder="Enter quantity"
            />
          </Form.Item>
          
          <Form.Item
            name={[formName, 'notes']}
            label="Pharmacist Notes"
            initialValue={prescription.pharmacist_note || ''}
          >
            <Input.TextArea 
              rows={2}
              disabled={disabled}
              placeholder="Add notes (optional)"
              className="w-full"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default BulkPrescriptionForm;