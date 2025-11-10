import React from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { 
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const AllSchedulesTab = ({ 
  loading, 
  schedules, 
  viewMode, 
  handleEdit, 
  handleCancel, 
  handleComplete 
}) => {
  const columns = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{record.first_name || 'Unknown Patient'}</div>
            {record.folderNumber && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                ID: {record.folderNumber}
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Procedure',
      dataIndex: 'primaryProcedure',
      key: 'primaryProcedure',
      render: (text) => (
        <Space>
          <MedicineBoxOutlined />
          <span>{text || 'No procedure specified'}</span>
        </Space>
      ),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'primaryDiagnosis',
      key: 'primaryDiagnosis',
      render: (text) => text || 'No diagnosis specified',
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <CalendarOutlined />
            <span>{record.scheduledDate ? dayjs(record.scheduledDate).format('MMM D, YYYY') : 'Not scheduled'}</span>
          </Space>
          {record.scheduledTime && (
            <Space>
              <ClockCircleOutlined />
              <span>{record.scheduledTime}</span>
            </Space>
          )}
        </Space>
      ),
      sorter: (a, b) => {
        const dateA = a.scheduledDate ? new Date(`${a.scheduledDate} ${a.scheduledTime || ''}`) : new Date(0);
        const dateB = b.scheduledDate ? new Date(`${b.scheduledDate} ${b.scheduledTime || ''}`) : new Date(0);
        return dateA - dateB;
      },
    },
    {
      title: 'Surgeon',
      dataIndex: 'surgeon',
      key: 'surgeon',
      render: (text) => text || 'Not assigned',
    },
    {
      title: 'Anaesthetist',
      dataIndex: 'anaesthetist',
      key: 'anaesthetist',
      render: (text) => text || 'Not assigned',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color, icon, text;
        switch (status) {
          case 'pre-operation':
            color = 'blue';
            icon = <SyncOutlined />;
            text = 'Pre-Operation';
            break;
          case 'intra-operation':
            color = 'orange';
            icon = <SyncOutlined spin />;
            text = 'In Surgery';
            break;
          case 'post-operation':
            color = 'green';
            icon = <CheckCircleOutlined />;
            text = 'Post-Operation';
            break;
          case 'cancelled':
            color = 'red';
            icon = <CloseCircleOutlined />;
            text = 'Cancelled';
            break;
          default:
            color = 'gray';
            icon = <SyncOutlined />;
            text = status || 'Unknown';
        }
        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'Pre-Operation', value: 'pre-operation' },
        { text: 'In Surgery', value: 'intra-operation' },
        { text: 'Post-Operation', value: 'post-operation' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Emergency',
      dataIndex: 'isEmergency',
      key: 'isEmergency',
      render: (isEmergency) => (
        <Tag color={isEmergency ? 'red' : 'default'}>
          {isEmergency ? 'EMERGENCY' : 'Elective'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {/* <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button> */}
          {record.status === 'pre-operation' && (
            <>
              <Popconfirm
                title="Are you sure you want to cancel this surgery?"
                onConfirm={() => handleCancel(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger icon={<CloseCircleOutlined />} size="small">
                  Cancel
                </Button>
              </Popconfirm>
              {/* <Button 
                type="link" 
                icon={<CheckCircleOutlined />} 
                onClick={() => console.log(record)}
                size="small"
              >
                Start Surgery
              </Button> */}
            </>
          )}
          {record.status === 'intra-operation' && (
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleComplete(record.id)}
              size="small"
            >
              Complete Surgery
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {viewMode === 'list' ? (
        <Table
          columns={columns}
          dataSource={schedules}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} schedules`
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      ) : (
        <div className="calendar-view">
          <p>Calendar view would show a weekly/daily schedule of OR bookings</p>
          {/* You can implement a proper calendar view here later */}
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            <CalendarOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>Calendar View Coming Soon</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllSchedulesTab;