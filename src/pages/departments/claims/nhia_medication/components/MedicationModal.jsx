import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Space } from 'antd';
import { BarcodeOutlined, FormOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createMedication, updateMedication } from '../../../../../redux/slice/nhia_medicationsSlice';

const { Option } = Select;

const MedicationModal = ({ visible, editingMed, loading, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (editingMed) {
          dispatch(updateMedication({ id: editingMed.id, ...values }));
        } else {
          dispatch(createMedication(values));
        }
        form.resetFields();
        onOk();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <FormOutlined />
          {editingMed ? 'Edit Medication' : 'Add New Medication'}
        </Space>
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          unit_of_pricing: 'per unit',
          is_nhia_covered: true,
          level_of_prescribing: 'C'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Medication Code"
              rules={[
                { required: true, message: 'Please input the medication code!' },
                { pattern: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' }
              ]}
            >
              <Input
                placeholder="e.g. ACETAZIN1"
                disabled={!!editingMed}
                prefix={<BarcodeOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="generic_name"
              label="Generic Name"
              rules={[{ required: true, message: 'Please input the generic name!' }]}
            >
              <Input placeholder="e.g. Acetazolamide" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="unit_of_pricing"
              label="Unit of Pricing"
              rules={[{ required: true, message: 'Please input unit of pricing!' }]}
            >
              <Input placeholder="e.g. per unit, per pack" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="market_price"
              label="Market Price (GHS)"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                precision={2}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="nhia_price"
              label="NHIA Price (GHS)"
              rules={[{ required: true, message: 'Please input NHIA price!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                precision={2}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="is_nhia_covered"
              label="NHIA Coverage"
            >
              <Select>
                <Option value={true}>Covered</Option>
                <Option value={false}>Not Covered</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="level_of_prescribing"
              label="Prescribing Level"
            >
              <Select placeholder="Select level">
                <Option value="A">A - General</Option>
                <Option value="B1">B1 - Specialist Initiation</Option>
                <Option value="B2">B2 - Specialist Continuation</Option>
                <Option value="C">C - Hospital Specialist</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default MedicationModal;