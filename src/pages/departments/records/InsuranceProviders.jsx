import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  Tag, 
  message,
  Card,
  Popconfirm,
  Collapse,
  Descriptions,
  Avatar,
  Typography,
  InputNumber,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons';
import { fetchInsuranceProviders, patchInsuranceInfo } from '../../../redux/slice/recordSlice';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Panel } = Collapse;
const { Title, Text } = Typography;
const { Column } = Table;

const InsuranceProviders = () => {
  const dispatch = useDispatch();
  const { insuranceProviders, loading } = useSelector((state) => state.records);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, searchText]);

  const fetchData = () => {
    dispatch(fetchInsuranceProviders({
      page: pagination.current,
      pageSize: pagination.pageSize,
      search: searchText
    }))
    .unwrap()
    .then((response) => {
      setPagination({
        ...pagination,
        total: response.meta?.total || 0,
      });
    })
    .catch(() => message.error('Failed to fetch insurance providers'));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const showModal = (record = null) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      insurance_expiry_date: record?.insurance_expiry_date ? dayjs(record.insurance_expiry_date) : null
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        insurance_expiry_date: values.insurance_expiry_date?.toISOString()
      };

      if (currentRecord) {
        await dispatch(patchInsuranceInfo({
          id: currentRecord.id,
          data: formattedValues
        })).unwrap();
        message.success('Insurance provider updated successfully');
      } else {
        // await dispatch(createInsuranceProvider(formattedValues)).unwrap();
        message.success('Insurance provider created successfully');
      }

      fetchData();
      handleCancel();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      // await dispatch(deleteInsuranceProvider(id)).unwrap();
      message.success('Insurance provider deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete insurance provider');
    }
  };

  const toggleRowExpansion = (recordId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(recordId)) {
      newExpandedRows.delete(recordId);
    } else {
      newExpandedRows.add(recordId);
    }
    setExpandedRows(newExpandedRows);
  };

  const PatientInfoCard = ({ patient }) => {
    if (!patient) return null;

    const age = patient.date_of_birth ? 
      new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : 'N/A';
    
    const fullName = `${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`.trim();

    return (
      <Card 
        size="small" 
        className="bg-gray-50 border-0 mt-2"
        bodyStyle={{ padding: '16px' }}
      >
        <Title level={5} className="!mb-4 !text-gray-700">Patient Information</Title>
        
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UserOutlined className="text-blue-600" />
                <div>
                  <Text strong className="text-gray-900 block">{fullName}</Text>
                  <Text type="secondary" className="text-sm">Full Name</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <IdcardOutlined className="text-green-600" />
                <div>
                  <Tag color="blue" className="font-mono">{patient.folder_number}</Tag>
                  <Text type="secondary" className="text-sm block">Patient ID</Text>
                </div>
              </div>
            </div>
          </Col>

          <Col span={8}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-purple-600" />
                <div>
                  <Text className="text-gray-900 block">
                    {patient.date_of_birth ? dayjs(patient.date_of_birth).format('DD/MM/YYYY') : 'N/A'}
                  </Text>
                  <Text type="secondary" className="text-sm">Date of Birth</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <UserOutlined className="text-orange-600" />
                <div>
                  <Tag color={patient.gender === 'M' ? 'blue' : 'pink'} className="capitalize">
                    {patient.gender === 'M' ? 'Male' : 'Female'}
                  </Tag>
                  <Text type="secondary" className="text-sm block">Gender & Age</Text>
                  <Text className="text-gray-600 text-sm">{age} years</Text>
                </div>
              </div>
            </div>
          </Col>

          <Col span={8}>
            <div className="space-y-3">
              {patient.metadata?.relatives?.next_of_kin && (
                <div className="flex items-center space-x-2">
                  <PhoneOutlined className="text-red-600" />
                  <div>
                    <Text className="text-gray-900 block">
                      {patient.metadata.relatives.next_of_kin.name}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      {patient.metadata.relatives.next_of_kin.relationship}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {patient.metadata.relatives.next_of_kin.phone}
                    </Text>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${patient.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div>
                  <Text className={`capitalize ${patient.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {patient.status}
                  </Text>
                  <Text type="secondary" className="text-sm block">Status</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {patient.metadata?.address && (
          <div className="mt-4 p-3 bg-white rounded border">
            <Text strong className="text-gray-700">Address: </Text>
            <Text className="text-gray-600">{patient.metadata.address}</Text>
          </div>
        )}
      </Card>
    );
  };

  const filteredData = insuranceProviders.filter(item => 
    item.insurance_number?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.patient?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.patient?.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.patient?.folder_number?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4">
      <Card 
        title={
          <div>
            <Title level={4} className="!mb-1">Insurance Providers</Title>
            <Text type="secondary">Manage patient insurance information and coverage</Text>
          </div>
        }
        bordered={false}
        className="shadow-sm"
        extra={
          <Space>
            <Input.Search
              placeholder="Search by NHIS, patient name, or ID"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              className="w-80"
              size="large"
            />
            {/* <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
              size="large"
            >
              Add Insurance
            </Button> */}
          </Space>
        }
      >
        <Table
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100', '200'],
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} insurance records`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          expandable={{
            expandedRowRender: (record) => <PatientInfoCard patient={record.patient} />,
            expandedRowKeys: Array.from(expandedRows),
            onExpand: (expanded, record) => toggleRowExpansion(record.id),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={e => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={e => onExpand(record, e)} />
              ),
          }}
        >
          <Column
            title="NHIS Number"
            dataIndex="insurance_number"
            key="insurance_number"
            sorter={(a, b) => a.insurance_number?.localeCompare(b.insurance_number)}
            render={(text) => <Tag color="geekblue" className="font-mono">{text}</Tag>}
            width={200}
          />
          
          <Column
            title="Provider"
            dataIndex="insurance_provider"
            key="insurance_provider"
            render={(provider) => <Tag color="blue">{provider}</Tag>}
            sorter={(a, b) => a.insurance_provider?.localeCompare(b.insurance_provider)}
            width={150}
          />
          
          <Column
            title="Patient Name"
            key="patient_name"
            render={(_, record) => {
              const patient = record.patient;
              const fullName = `${patient?.first_name || ''} ${patient?.middle_name || ''} ${patient?.last_name || ''}`.trim();
              return (
                <div className="flex items-center space-x-2">
                  <Avatar size="small" icon={<UserOutlined />} className="bg-blue-500" />
                  <span>{fullName || 'N/A'}</span>
                </div>
              );
            }}
            sorter={(a, b) => {
              const nameA = `${a.patient?.first_name} ${a.patient?.last_name}`;
              const nameB = `${b.patient?.first_name} ${b.patient?.last_name}`;
              return nameA.localeCompare(nameB);
            }}
            width={200}
          />
          
          <Column
            title="Patient ID"
            key="patient_id"
            render={(_, record) => (
              <Text className="font-mono text-gray-600">
                {record.patient?.folder_number || 'N/A'}
              </Text>
            )}
            width={150}
          />
          
          <Column
            title="Expiry Date"
            dataIndex="insurance_expiry_date"
            key="insurance_expiry_date"
            render={(date) => (
              <div>
                <div className={`font-medium ${
                  dayjs(date).isBefore(dayjs().add(30, 'day')) ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {dayjs(date).format('DD/MM/YYYY')}
                </div>
                {dayjs(date).isBefore(dayjs().add(30, 'day')) && (
                  <Text type="secondary" className="text-xs">
                    Expires soon
                  </Text>
                )}
              </div>
            )}
            sorter={(a, b) => new Date(a.insurance_expiry_date) - new Date(b.insurance_expiry_date)}
            width={150}
          />
          
          <Column
            title="Status"
            key="insurance_status"
            render={(_, record) => {
              const isExpired = dayjs(record.insurance_expiry_date).isBefore(dayjs());
              const isExpiringSoon = dayjs(record.insurance_expiry_date).isBefore(dayjs().add(30, 'day'));
              
              if (isExpired) {
                return <Tag color="red">Expired</Tag>;
              } else if (isExpiringSoon) {
                return <Tag color="orange">Expiring Soon</Tag>;
              } else {
                return <Tag color="green">Active</Tag>;
              }
            }}
            width={120}
          />

          <Column
            title="Action"
            key="action"
            fixed="right"
            width={120}
            render={(_, record) => (
              <Space size="small">
                <Button 
                  type="link" 
                  icon={<EditOutlined />} 
                  onClick={() => showModal(record)}
                  title="Edit insurance"
                />
                <Popconfirm
                  title="Delete Insurance Record"
                  description="Are you sure you want to delete this insurance record?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                  okType="danger"
                >
                  <Button 
                    type="link" 
                    danger 
                    icon={<DeleteOutlined />}
                    title="Delete insurance"
                  />
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </Card>

      <Modal
        title={
          <div>
            <Title level={4} className="!mb-1">
              {currentRecord ? 'Edit Insurance Provider' : 'Add Insurance Provider'}
            </Title>
            {currentRecord?.patient && (
              <Text type="secondary">
                For: {currentRecord.patient.first_name} {currentRecord.patient.last_name}
              </Text>
            )}
          </div>
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
        okText={currentRecord ? 'Update Insurance' : 'Add Insurance'}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="insurance_number"
            label="NHIS Number"
            rules={[
              { required: true, message: 'Please input NHIS number!' },
              { min: 6, message: 'NHIS number must be at least 6 characters' }
            ]}
          >
            <Input 
              placeholder="Enter NHIS number" 
              size="large"
              prefix={<IdcardOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="insurance_provider"
            label="Insurance Provider"
            rules={[{ required: true, message: 'Please select insurance provider!' }]}
          >
            <Input 
              placeholder="Enter provider name" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="insurance_expiry_date"
            label="Expiry Date"
            rules={[{ required: true, message: 'Please select expiry date!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InsuranceProviders;