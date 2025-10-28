import React, { useState } from 'react';
import { Modal, Radio, Button, message, Form, Tag } from 'antd';
import { useDispatch } from 'react-redux';

const statusOptions = [
  { value: 'Active', label: 'Active', color: 'green' },
  { value: 'Admitted', label: 'Admitted', color: 'purple' },
  { value: 'Discharged', label: 'Discharged', color: 'blue' },
  { value: 'pending', label: 'Pending', color: 'orange' },
  { value: 'Referred', label: 'Referred', color: 'cyan' },
  { value: 'Deceased', label: 'Deceased', color: 'red' },
];

const PatientStatusModal = ({ 
  visible, 
  onClose, 
  currentStatus, 
  patientId, 
  visitId,
  onStatusChange 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
     

      message.success('Patient status updated successfully');
      onStatusChange(); // Refresh patient data
      onClose();
    } catch (error) {
      message.error('Failed to update patient status');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Patient Status"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          Update Status
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: currentStatus }}
      >
        <Form.Item
          name="status"
          label="Current Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Radio.Group>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {statusOptions.map((option) => (
                <Radio.Button 
                  key={option.value} 
                  value={option.value}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '16px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${currentStatus === option.value ? option.color : '#d9d9d9'}`,
                    backgroundColor: currentStatus === option.value ? `${option.color}10` : 'transparent'
                  }}
                >
                  <Tag 
                    color={option.color} 
                    style={{ 
                      marginRight: '8px',
                      fontSize: '12px',
                      padding: '2px 8px'
                    }}
                  >
                    {option.label}
                  </Tag>
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>
        </Form.Item>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f6f6f6', borderRadius: '4px' }}>
          <p style={{ marginBottom: '8px', fontWeight: '500' }}>Status Descriptions:</p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><Tag color="green">Active</Tag> - Patient is currently receiving care</li>
            <li><Tag color="purple">Admitted</Tag> - Patient has been admitted to the hospital</li>
            <li><Tag color="blue">Discharged</Tag> - Patient has been discharged</li>
            <li><Tag color="orange">Pending</Tag> - Patient status is pending review</li>
            <li><Tag color="cyan">Referred</Tag> - Patient has been referred to another facility</li>
            <li><Tag color="red">Deceased</Tag> - Patient has passed away</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default PatientStatusModal;