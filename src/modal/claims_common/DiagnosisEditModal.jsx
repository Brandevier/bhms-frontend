import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Spin, Tag, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDiagnoses } from '../../redux/slice/icd10DdiangosisSlice';

const { Text } = Typography;
const { Option } = Select;

const DiagnosisEditModal = ({ 
  visible, 
  onCancel, 
  onSave, 
  currentDiagnosis 
}) => {
  const [form] = Form.useForm();
  const { completeList = [], loading } = useSelector((state) => state.icd10);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      dispatch(fetchAllDiagnoses());
      form.setFieldsValue({
        diagnosis: currentDiagnosis?.gdrg_code || ''
      });
    }
  }, [visible]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const selectedDiagnosis = completeList.find(d => d.icd_10_code === values.diagnosis);
      onSave({
        gdrg_code: selectedDiagnosis.icd_10_code,
        description: selectedDiagnosis.diagnosis_name
      });
      onCancel();
    });
  };

  return (
    <Modal
      title="Select Diagnosis"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      okText="Confirm Diagnosis"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="diagnosis"
          label="Search Diagnosis"
          rules={[{ required: true, message: 'Please select a diagnosis' }]}
        >
          <Select
            showSearch
            placeholder="Search by code or name"
            optionFilterProp="children"
            filterOption={(input, option) => {
              const children = option.children.props.children;
              const code = children?.[0].props.children;
              const name = children?.[1].props.children;
              return (
                code.toLowerCase().includes(input.toLowerCase()) ||
                name.toLowerCase().includes(input.toLowerCase())
              );
            }}
            notFoundContent={loading ? <Spin size="small" /> : 'No diagnoses found'}
            suffixIcon={<SearchOutlined />}
          >
            {completeList.map(diagnosis => (
              <Option key={diagnosis.id} value={diagnosis.icd_10_code}>
                <div>
                  <Tag color="blue">{diagnosis.icd_10_code}</Tag>
                  <Text>{diagnosis.diagnosis_name}</Text>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DiagnosisEditModal;