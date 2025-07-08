import React, { useEffect, useState } from 'react';

import { 
  Table, Button, Card, Tag, Space, Modal, Form, Input, 
  Select, Divider, notification, Popconfirm, Typography, 
  Row, Col, Statistic, Badge, InputNumber, DatePicker, Tooltip
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, SyncOutlined, FileTextOutlined,
  BarcodeOutlined, ManOutlined, WomanOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { 

  fetchDiagnoses, 
  fetchAllDiagnoses,
  fetchDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
  selectFilteredDiagnoses,
  selectAllDiagnoses,
  selectCurrentDiagnosis,
  selectDiagnosesLoading,
  selectDiagnosesError,
  selectDiagnosesFilters,
  setDiagnosisFilters,
  clearCurrentDiagnosis
 } from '../../../redux/slice/icd10DdiangosisSlice';


const { Title, Text } = Typography;
const { Option } = Select;

const ICD10Diagnosis = () => {
  const dispatch = useDispatch();
  const diagnoses = useSelector(selectFilteredDiagnoses);
  const allDiagnoses = useSelector(selectAllDiagnoses);
  const currentDiagnosis = useSelector(selectCurrentDiagnosis);
  const loading = useSelector(selectDiagnosesLoading);
  const error = useSelector(selectDiagnosesError);
  const filters = useSelector(selectDiagnosesFilters);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);

  // Columns configuration
  const columns = [
    {
      title: 'ICD-10 Code',
      dataIndex: 'icd_10_code',
      key: 'icd_10_code',
      width: 150,
      render: (code) => <Tag icon={<BarcodeOutlined />} color="blue">{code}</Tag>,
      sorter: (a, b) => a.icd_10_code.localeCompare(b.icd_10_code),
    },
    {
      title: 'Diagnosis Name',
      dataIndex: 'diagnosis_name',
      key: 'diagnosis_name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 120,
      render: (gender) => gender ? (
        <Tag color={gender === 'Male' ? 'geekblue' : 'pink'}>
          {gender === 'Male' ? <ManOutlined /> : <WomanOutlined />} {gender}
        </Tag>
      ) : 'Both',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this diagnosis?"
              onConfirm={() => dispatch(deleteDiagnosis(record.id))}
            >
              <Button 
                danger 
                size="small" 
                icon={<DeleteOutlined />} 
                loading={loading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (editingDiagnosis) {
          dispatch(updateDiagnosis({ id: editingDiagnosis.id, ...values }));
        } else {
          dispatch(createDiagnosis(values));
        }
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // Edit diagnosis handler
  const handleEdit = (diagnosis) => {
    setEditingDiagnosis(diagnosis);
    form.setFieldsValue(diagnosis);
    setIsModalVisible(true);
  };

  // Reset modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingDiagnosis(null);
    form.resetFields();
    dispatch(clearCurrentDiagnosis());
  };

  // Handle search
  const handleSearch = (value) => {
    dispatch(setDiagnosisFilters({ search: value }));
  };

  // Notification for errors
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Operation Failed',
        description: error,
        placement: 'bottomRight',
      });
    }
  }, [error]);

  // Initial data load
  useEffect(() => {
    dispatch(fetchAllDiagnoses());
    // dispatch(fetchDiagnoses(filters));
  }, [dispatch, filters]);

  return (
    <div className="icd10-diagnosis-page" style={{ padding: 24 }}>
      {/* Header Card */}
      <Card 
        bordered={false}
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>ICD-10 Diagnosis Management</Title>
          </Space>
        }
        extra={
          <Space>
            <Input.Search
              placeholder="Search diagnoses..."
              prefix={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
              allowClear
              enterButton
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add Diagnosis
            </Button>
            <Tooltip title="Refresh">
              <Button 
                icon={<SyncOutlined />}
                onClick={() => {
                  dispatch(fetchAllDiagnoses());
                  dispatch(fetchDiagnoses(filters));
                }}
              />
            </Tooltip>
          </Space>
        }
      >
        {/* Summary Stats */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Total Diagnoses"
                value={allDiagnoses.length}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Male Diagnoses"
                value={allDiagnoses.filter(d => d.gender === 'Male').length}
                prefix={<ManOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Female Diagnoses"
                value={allDiagnoses.filter(d => d.gender === 'Female').length}
                prefix={<WomanOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Diagnoses Table */}
        <Table
          columns={columns}
          dataSource={allDiagnoses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Add/Edit Diagnosis Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            {editingDiagnosis ? 'Edit ICD-10 Diagnosis' : 'Add New ICD-10 Diagnosis'}
          </Space>
        }
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleModalClose}
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
                <Input placeholder="e.g. E11.9" />
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
            label="Gender Specific"
            rules={[{ required: true, message: 'Please select gender specificity!' }]}
          >
            <Select placeholder="Select gender">
              <Option value="Male">Male Specific</Option>
              <Option value="Female">Female Specific</Option>
              <Option value={null}>Not Gender Specific</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ICD10Diagnosis;