import React from 'react';
import { Table, Badge, Button, Space, Tooltip, Tag, Avatar,Card } from 'antd';
import { 
  FileSearchOutlined, 
  HistoryOutlined, 
  PlusCircleOutlined,
  UserOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const PatientTable = ({ patients, loading, onInitiateVisit, searchTerm }) => {
  const navigate = useNavigate();

  const filteredPatients = patients?.filter(p =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    p.folder_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      title: 'Patient Information',
      dataIndex: 'first_name',
      key: 'name',
      width: 250,
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size="large" 
            src={record.photo} 
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              {record.patient?.first_name} {record.patient?.middle_name || ''} {record.patient?.last_name}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 capitalize">{record.gender}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                {record.patient?.date_of_birth ? dayjs(record.patient?.date_of_birth).format('MMM DD, YYYY') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Folder Number',
      dataIndex: 'attendance_number',
      key: 'attendance_number',
      width: 120,
      sorter: (a, b) => a.attendance_number?.localeCompare(b.attendance_number),
      render: (text) => (
        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
          {text}
        </span>
      )
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      sorter: (a, b) => a.patient?.gender?.localeCompare(b.patient?.gender),
      render: (gender) => (
        <Tag 
          color={gender === 'M' ? 'blue' : gender === 'F' ? 'pink' : 'default'}
          className="capitalize font-medium text-xs"
        >
          {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
        </Tag>
      )
    },
    {
      title: 'Insurance',
      dataIndex: 'has_insurance',
      key: 'insurance',
      width: 120,
      sorter: (a, b) => (a.patient?.has_insurance ? 1 : 0) - (b.patient?.has_insurance ? 1 : 0),
      render: (hasInsurance, record) => (
        <div className="flex items-center space-x-2">
          <IdcardOutlined className={hasInsurance ? "text-green-500 text-sm" : "text-gray-400 text-sm"} />
          <span className={`text-xs font-medium ${record?.patient?.has_insurance ? 'text-green-600' : 'text-gray-500'}`}>
            {record?.patient?.has_insurance ? 'Insured' : 'Not Insured'}
          </span>
          {record?.patient?.has_insurance && record.insurance?.insurance_provider && (
            <Tag color="green" className="text-xs">
              {record.insurance.insurance_provider}
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'Date Visited',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      render: (date) => (
        <div className="text-xs text-gray-600">
          {date ? dayjs(date).format('MMM D, YYYY') : 'N/A'}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
      render: (status) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={
            <span className={`text-xs font-medium ${
              status === 'active' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
            </span>
          }
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Patient Details">
            <Button
              icon={<FileSearchOutlined />}
              size="small"
              className="border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
              onClick={() => navigate(`/shared/records/folder/${record.id}`, { id: record.id })}
            />
          </Tooltip>

          {record.status === 'active' ? (
            <Tooltip title="Visit In Progress">
              <Button
                type="dashed"
                size="small"
                disabled
                className="text-orange-500 border-orange-200 text-xs"
              >
                <HistoryOutlined className="mr-1" />
                In Visit
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Initiate New Visit">
              <Button
                type="primary"
                size="small"
                onClick={() => onInitiateVisit(record)}
                className="bg-blue-500 border-blue-500 hover:bg-blue-600 text-xs h-7"
              >
                <PlusCircleOutlined className="mr-1" />
                Visit
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card className="border-0 shadow-sm rounded-xl bg-white">
      <Table
        columns={columns}
        dataSource={filteredPatients}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} patients`,
          pageSizeOptions: ['10', '20', '50', '100'],
          size: 'small'
        }}
        scroll={{ x: 1000 }}
        size="small"
        className="patient-table"
        rowClassName="hover:bg-blue-50 transition-colors duration-150"
      />
    </Card>
  );
};

export default PatientTable;