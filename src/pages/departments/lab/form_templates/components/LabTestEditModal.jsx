import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space, Alert, Typography } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const LabTestEditModal = ({ visible, test, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testValues, setTestValues] = useState([]);

  useEffect(() => {
    if (test && visible) {
      // Initialize form with test data
      form.setFieldsValue({
        notes: test.notes || '',
        status: test.status || 'pending'
      });

      // Parse test values if they exist
      if (test.values) {
        const values = Object.entries(test.values).map(([key, value]) => ({
          key,
          value
        }));
        setTestValues(values);
      } else {
        setTestValues([]);
      }
    }
  }, [test, visible, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare the data for submission
      const submitData = {
        ...values,
        values: testValues.reduce((acc, item) => {
          if (item.key && item.value !== undefined) {
            acc[item.key] = item.value.toString();
          }
          return acc;
        }, {})
      };

      console.log('Submitting lab test data:', submitData);
      
      // Here you would call your API to update the lab test
      // await updateLabTest(test.id, submitData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Error updating lab test:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTestValue = () => {
    setTestValues([...testValues, { key: '', value: '' }]);
  };

  const removeTestValue = (index) => {
    const newValues = testValues.filter((_, i) => i !== index);
    setTestValues(newValues);
  };

  const updateTestValue = (index, field, value) => {
    const newValues = testValues.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setTestValues(newValues);
  };

  if (!test) return null;

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Edit Lab Test Results
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Alert
        message={`Editing: ${test.template?.description}`}
        description={`Patient: ${test.visit?.patient?.first_name} ${test.visit?.patient?.last_name}`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Test Values Section */}
        <div style={{ marginBottom: 16 }}>
          <Text strong>Test Values</Text>
          {testValues.map((item, index) => (
            <Space key={index} style={{ width: '100%', marginBottom: 8 }} align="baseline">
              <Input
                placeholder="Parameter key"
                value={item.key}
                onChange={(e) => updateTestValue(index, 'key', e.target.value)}
                style={{ width: 200 }}
              />
              <Input
                placeholder="Value"
                value={item.value}
                onChange={(e) => updateTestValue(index, 'value', e.target.value)}
                style={{ width: 150 }}
              />
              <Button
                type="link"
                danger
                onClick={() => removeTestValue(index)}
              >
                Remove
              </Button>
            </Space>
          ))}
          <Button type="dashed" onClick={addTestValue} style={{ width: '100%', marginBottom: 16 }}>
            Add Test Parameter
          </Button>
        </div>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea
            rows={3}
            placeholder="Enter any notes about this test..."
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select status">
            <Option value="pending">Pending</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              Save Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LabTestEditModal;