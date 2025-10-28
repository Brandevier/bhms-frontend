import React from 'react';
import { Table, Tag, Badge, Button, Avatar, Tooltip } from 'antd';
import { 
  EyeOutlined, 
  UserOutlined, 
  CalendarOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const PatientRecordsTable = ({ data, loading }) => {
  const navigate = useNavigate();

  const handleView = (record) => {
    navigate(`/shared/patient/details/${record.id}`, { id: record.id });
  };

  const getVisitTypeColor = (visitType) => {
    const colors = {
      'General OPD': 'blue',
      'Emergency': 'red',
      'Follow-up': 'green',
      'Consultation': 'purple',
      'Routine': 'orange'
    };
    return colors[visitType] || 'default';
  };

  const columns = [
    {
      title: 'Patient Information',
      key: 'patient_info',
      width: 280,
      fixed: 'left',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size="large" 
            src={record.patient?.photo} 
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              {record.patient?.first_name || 'N/A'} {record.patient?.last_name || ''}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">
                {record.patient?.date_of_birth ? 
                  `${moment().diff(moment(record.patient.date_of_birth), 'years')} years` : 
                  'Age N/A'
                }
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 capitalize">
                {record.patient?.gender || 'N/A'}
              </span>
            </div>
            {record.patient?.folder_number && (
              <div className="flex items-center mt-1">
                <IdcardOutlined className="text-gray-400 text-xs mr-1" />
                <span className="text-xs text-gray-500">{record.patient.folder_number}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Attendance No.',
      dataIndex: 'attendance_number',
      key: 'attendance_number',
      width: 160,
      render: (text) => (
        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
          {text || 'N/A'}
        </span>
      )
    },
    {
      title: 'Visit Type',
      dataIndex: 'visit_type',
      key: 'visit_type',
      width: 140,
      render: (visitType) => (
        <Tag 
          color={getVisitTypeColor(visitType)} 
          className="capitalize font-medium text-xs"
        >
          {visitType || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Department',
      dataIndex: ['department', 'name'],
      key: 'department',
      width: 160,
      render: (departmentName) => (
        <span className="text-xs text-gray-600">{departmentName || 'N/A'}</span>
      )
    },
    {
      title: 'Visit Date & Time',
      dataIndex: 'visit_date',
      key: 'visit_date',
      width: 180,
      render: (date) => (
        <div className="flex flex-col">
          <div className="flex items-center text-xs text-gray-600">
            <CalendarOutlined className="mr-1" />
            {date ? moment(date).format('MMM D, YYYY') : 'N/A'}
          </div>
          <div className="text-xs text-gray-400">
            {date ? moment(date).format('h:mm A') : ''}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Badge
          status={status === 'Active' ? 'processing' : 'default'}
          text={
            <span className={`text-xs font-medium ${
              status === 'Active' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {status || 'N/A'}
            </span>
          }
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="View Patient Details">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            className="bg-blue-500 border-blue-500 hover:bg-blue-600"
          />
        </Tooltip>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1200 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} visits`,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      className="patient-records-table"
      rowClassName="hover:bg-blue-50 transition-colors duration-150"
    />
  );
};

export default PatientRecordsTable;