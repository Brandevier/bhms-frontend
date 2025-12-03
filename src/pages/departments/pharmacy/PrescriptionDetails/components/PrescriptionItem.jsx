import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  Space,
  Typography,
  InputNumber,
  Input,
  Button,
  Tag,
  message,
  Form,
} from 'antd';
import { MedicineBoxOutlined, CheckOutlined } from '@ant-design/icons';
import { updatePrescriptionStatus } from '../../../../../redux/slice/prescriptionSlice';

const { Text } = Typography;

const PrescriptionItem = ({ prescription, visitId, onSuccess }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleDispense = async (values) => {
    try {
      setLoading(true);
      await dispatch(updatePrescriptionStatus({
        id: prescription.id,
        status: 'dispensed',
        claim_id: prescription?.visit?.claims?.[0]?.id || null,
        patient_id: prescription?.visit?.patient?.id,
        dispensed_quantity: parseInt(values.dispensedQuantity, 10),
        pharmacist_notes: values.notes
      })).unwrap();
      
      message.success(`${prescription.medicine?.generic_name} dispensed successfully`);
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(`Failed to dispense: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      size="small" 
      className="mb-3 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleDispense}
        initialValues={{
          dispensedQuantity: prescription.quantity || 1,
          notes: prescription.pharmacist_note || ''
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Prescription Info */}
          <div className="md:col-span-2">
            <Space direction="vertical" size="small" className="w-full">
              <div className="flex items-start justify-between">
                <div>
                  <Text strong className="text-lg flex items-center gap-2">
                    <MedicineBoxOutlined className="text-blue-500" />
                    {prescription.medicine?.generic_name || 'Unknown Medication'}
                  </Text>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Dosage:</span>
                      <span className="font-medium">{prescription.dosage}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium">{prescription.frequency}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{prescription.duration} days</span>
                    </div>
                  </div>
                </div>
                <Tag color={prescription.status === 'pending' ? 'orange' : 'green'}>
                  {prescription.status.toUpperCase()}
                </Tag>
              </div>
            </Space>
          </div>

          {/* Right Column: Form Fields */}
          <div className="space-y-3">
            <Form.Item
              label="Dispensed Quantity"
              name="dispensedQuantity"
              rules={[
                { required: true, message: 'Please enter quantity' },
                { type: 'number', min: 1, message: 'Quantity must be at least 1' }
              ]}
            >
              <InputNumber 
                min={1} 
                className="w-full"
                placeholder="Enter quantity"
              />
            </Form.Item>
            
            <Form.Item
              label="Pharmacist Notes"
              name="notes"
            >
              <Input.TextArea 
                rows={2}
                placeholder="Add notes (optional)"
                className="w-full"
              />
            </Form.Item>

            {prescription.status === 'pending' && (
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<CheckOutlined />}
                  className="w-full"
                >
                  Dispense
                </Button>
              </Form.Item>
            )}
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default PrescriptionItem;