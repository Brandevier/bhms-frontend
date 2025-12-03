import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Space,
  Typography,
  Form,
  message,
  Alert,
  Collapse,
  Tag,
  Progress,
  Divider,
} from 'antd';
import { 
  CheckOutlined, 
  MedicineBoxOutlined,
  UploadOutlined,
  FileTextOutlined 
} from '@ant-design/icons';
import BulkPrescriptionForm from './BulkPrescriptionForm';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const BulkDispenseModal = ({ visible, onCancel, prescriptions, visitId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  // Initialize form values with prescriptions
  const initialValues = prescriptions.reduce((acc, prescription) => {
    acc[`prescription_${prescription.id}`] = {
      dispensedQuantity: prescription.quantity || 1,
      notes: prescription.pharmacist_note || ''
    };
    return acc;
  }, {});

  const handleSubmit = async (values) => {
    if (processing) return;
    
    setProcessing(true);
    setProgress(0);
    setResults([]);

    const prescriptionsToDispense = prescriptions.map(prescription => {
      const formData = values[`prescription_${prescription.id}`];
      return {
        id: prescription.id,
        status: 'dispensed',
        claim_id: prescription?.visit?.claims?.[0]?.id || null,
        patient_id: prescription?.visit?.patient?.id,
        dispensed_quantity: parseInt(formData?.dispensedQuantity || prescription.quantity || 1, 10),
        pharmacist_notes: formData?.notes || ''
      };
    });

    const total = prescriptionsToDispense.length;
    const processResults = [];

    try {
      for (let i = 0; i < prescriptionsToDispense.length; i++) {
        const prescription = prescriptionsToDispense[i];
        
        try {
          // Dispatch each prescription update
          await dispatch(updatePrescriptionStatus(prescription)).unwrap();
          
          processResults.push({
            id: prescription.id,
            medication: prescriptions[i].medicine?.generic_name,
            status: 'success',
            message: 'Successfully dispensed'
          });
        } catch (error) {
          processResults.push({
            id: prescription.id,
            medication: prescriptions[i].medicine?.generic_name,
            status: 'error',
            message: error.message || 'Failed to dispense'
          });
        }
        
        // Update progress
        const newProgress = Math.round(((i + 1) / total) * 100);
        setProgress(newProgress);
      }

      setResults(processResults);
      
      const successCount = processResults.filter(r => r.status === 'success').length;
      message.success(`Successfully dispensed ${successCount} out of ${total} prescriptions`);
      
      // Refresh prescriptions list
      dispatch(fetchPrescriptionsByVisit(visitId));
      
    } catch (error) {
      message.error('Bulk dispense failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      handleSubmit(values);
    });
  };

  const getSuccessRate = () => {
    if (results.length === 0) return 0;
    const successCount = results.filter(r => r.status === 'success').length;
    return Math.round((successCount / results.length) * 100);
  };

  return (
    <Modal
      title={
        <Space>
          <UploadOutlined />
          <span>Bulk Dispense Prescriptions</span>
          <Tag color="orange">{prescriptions.length} pending</Tag>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={
        <Space>
          <Button onClick={onCancel} disabled={processing}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            loading={processing}
            icon={<CheckOutlined />}
            disabled={prescriptions.length === 0}
          >
            {processing ? 'Processing...' : 'Dispense All'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className="mt-4"
      >
        {processing && (
          <div className="mb-6">
            <Progress percent={progress} status="active" />
            <Text type="secondary" className="block text-center mt-2">
              Dispensing prescriptions... {progress}%
            </Text>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-6">
            <Alert
              message={`Processing Complete - ${getSuccessRate()}% Success Rate`}
              type={getSuccessRate() === 100 ? 'success' : 'warning'}
              showIcon
              className="mb-4"
            />
            <Collapse size="small">
              <Panel header="View Details" key="1">
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded ${
                        result.status === 'success' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <Text strong>{result.medication}</Text>
                        <Tag color={result.status === 'success' ? 'green' : 'red'}>
                          {result.status === 'success' ? '✓' : '✗'} {result.status}
                        </Tag>
                      </div>
                      <Text type="secondary" className="text-xs">
                        {result.message}
                      </Text>
                    </div>
                  ))}
                </div>
              </Panel>
            </Collapse>
          </div>
        )}

        <div className="max-h-[500px] overflow-y-auto pr-2">
          <Alert
            message="Fill in dispensed quantity and notes for each prescription"
            description="All fields with * are required. You can submit all at once."
            type="info"
            showIcon
            className="mb-4"
          />

          <div className="space-y-4">
            {prescriptions.map((prescription, index) => (
              <BulkPrescriptionForm
                key={prescription.id}
                prescription={prescription}
                index={index + 1}
                form={form}
                disabled={processing}
              />
            ))}
          </div>

          {prescriptions.length === 0 && (
            <div className="text-center py-8">
              <FileTextOutlined className="text-4xl text-gray-300 mb-4" />
              <Text type="secondary">No pending prescriptions to dispense</Text>
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};

// Make sure to import the actual function

export default BulkDispenseModal;