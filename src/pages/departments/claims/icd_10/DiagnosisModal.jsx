// DiagnosisModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { FileTextOutlined } from '@ant-design/icons';
import { 
  createDiagnosis, 
  updateDiagnosis 
} from '../../../../redux/slice/icd10DdiangosisSlice';

const { Option } = Select;

const DiagnosisModal = ({ visible, editingDiagnosis, onCancel, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible && editingDiagnosis) {
      form.setFieldsValue(editingDiagnosis);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, editingDiagnosis, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (editingDiagnosis) {
          dispatch(updateDiagnosis({ 
            id: editingDiagnosis.id, 
            ...values 
          }));
        } else {
          dispatch(createDiagnosis(values));
        }
        onCancel();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          {editingDiagnosis ? 'Edit ICD-10 Diagnosis' : 'Add New ICD-10 Diagnosis'}
        </Space>
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="icd_10_code"
              label="ICD-10 Code"
              rules={[
                { required: true, message: 'Please input the ICD-10 code!' },
                { 
                  pattern: /^[A-Z][0-9]{2}(\.[0-9]{1,4})?$/,
                  message: 'Please enter a valid ICD-10 code (e.g. E11.9)'
                }
              ]}
            >
              <Input placeholder="e.g. E11.9" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="diagnosis_name"
              label="Diagnosis Name"
              rules={[{ required: true, message: 'Please input the diagnosis name!' }]}
            >
              <Input placeholder="e.g. Type 2 diabetes mellitus" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="gender"
          label="Gender Specificity"
          rules={[{ required: true, message: 'Please select gender specificity!' }]}
        >
          <Select placeholder="Select gender specificity">
            <Option value="Male">Male Specific</Option>
            <Option value="Female">Female Specific</Option>
            <Option value={null}>Not Gender Specific</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DiagnosisModal;