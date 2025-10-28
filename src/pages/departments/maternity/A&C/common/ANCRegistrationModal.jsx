// components/maternity/ANCRegistrationModal.js
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  DatePicker, 
  Button, 
  message,
  Spin,
  Row,
  Col 
} from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useANCActions, useANCLoading, useANCError, useANCSuccess } from '../../../../../redux/hooks/useANC';

import moment from 'moment';

const { Option } = Select;

const ANCRegistrationModal = ({ visitId, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { createANCRecord, clearANCError, clearANC } = useANCActions();
  const loading = useANCLoading();
  const error = useANCError();
  const success = useANCSuccess();
  const [currentYear] = useState(new Date().getFullYear());
 
  useEffect(() => {
    if (success) {
      message.success('ANC record created successfully!');
      form.resetFields();
      clearANC();
      onSuccess?.();
    }
  }, [success, form, clearANC, onSuccess]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearANCError();
    }
  }, [error, clearANCError]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      // Set default values when modal opens
      form.setFieldsValue({
        year: currentYear,
        hiv_status: 'Unknown'
      });
    }
  }, [visible, form, currentYear]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = async (values) => {
    const ancData = {
      visit_id: visitId,
      year: values.year,
      mother_age: values.mother_age,
      parity: values.parity,
      gestational_age_weeks: values.gestational_age_weeks,
      blood_pressure: values.blood_pressure,
      hemoglobin_level: values.hemoglobin_level,
      hiv_status: values.hiv_status
    };

    console.log(ancData);

    await createANCRecord(ancData);
  };

  return (
    <Modal
      title="Register ANC"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="year"
                label="Year"
                rules={[{ required: true, message: 'Please enter year' }]}
              >
                <InputNumber 
                  min={2000} 
                  max={2100} 
                  className="w-full" 
                  placeholder="Enter year"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mother_age"
                label="Mother's Age"
                rules={[{ required: true, message: 'Please enter mother\'s age' }]}
              >
                <InputNumber 
                  min={15} 
                  max={50} 
                  className="w-full" 
                  placeholder="Age in years"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="parity"
                label="Parity"
                rules={[{ required: true, message: 'Please enter parity' }]}
              >
                <InputNumber 
                  min={0} 
                  max={20} 
                  className="w-full" 
                  placeholder="Number of pregnancies"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gestational_age_weeks"
                label="Gestational Age (weeks)"
                rules={[{ required: true, message: 'Please enter gestational age' }]}
              >
                <InputNumber 
                  min={0} 
                  max={42} 
                  className="w-full" 
                  placeholder="Weeks of pregnancy"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="blood_pressure"
                label="Blood Pressure"
                rules={[{ 
                  pattern: /^\d{2,3}\/\d{2,3}$/,
                  message: 'Please enter valid BP format (e.g., 120/80)' 
                }]}
              >
                <Input 
                  placeholder="e.g., 120/80" 
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hemoglobin_level"
                label="Hemoglobin Level (g/dL)"
                rules={[{ 
                  required: true, 
                  message: 'Please enter hemoglobin level' 
                }]}
              >
                <InputNumber 
                  min={0} 
                  max={20} 
                  step={0.1} 
                  className="w-full" 
                  placeholder="e.g., 12.5"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="hiv_status"
            label="HIV Status"
            rules={[{ required: true, message: 'Please select HIV status' }]}
          >
            <Select placeholder="Select HIV status" className="w-full">
              <Option value="Positive">Positive</Option>
              <Option value="Negative">Negative</Option>
              <Option value="Unknown">Unknown</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-3">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<PlusOutlined />}
                loading={loading}
              >
                Register ANC
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ANCRegistrationModal;