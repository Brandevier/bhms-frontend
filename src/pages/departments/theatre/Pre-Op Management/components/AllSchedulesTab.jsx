import React from 'react';
import { Table, Tag, Space } from 'antd';
import { 
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined
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
      dataIndex: ['patient', 'name'],
      key: 'patient',
      render: (text) => (
        <Space>
          <UserOutlined />
          <span>{text || 'Unknown'}</span>
        </Space>
      ),
    },
    {
      title: 'Procedure',
      dataIndex: 'procedure',
      key: 'procedure',
      render: (text) => text || 'Not specified',
    },
    {
      title: 'Date & Time',
      dataIndex: 'scheduled_date',
      key: 'datetime',
      render: (_, record) => (
        <Space>
          <CalendarOutlined />
          <span>{dayjs(record.scheduled_date).format('MMM D, YYYY')}</span>
          <ClockCircleOutlined />
          <span>{record.scheduled_time}</span>
        </Space>
      ),
      sorter: (a, b) => {
        const dateA = new Date(`${a.scheduled_date} ${a.scheduled_time}`);
        const dateB = new Date(`${b.scheduled_date} ${b.scheduled_time}`);
        return dateA - dateB;
      },
    },
    {
      title: 'Surgeon',
      dataIndex: ['surgeon', 'name'],
      key: 'surgeon',
      render: (text) => text || 'Not assigned',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color, icon;
        switch (status.toLowerCase()) {
          case 'scheduled':
            color = 'blue';
            icon = <SyncOutlined />;
            break;
          case 'completed':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'cancelled':
            color = 'red';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'gray';
        }
        return (
          <Tag icon={icon} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {record.status === 'Scheduled' && (
            <>
              <Popconfirm
                title="Are you sure you want to cancel this surgery?"
                onConfirm={() => handleCancel(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger icon={<CloseCircleOutlined />}>
                  Cancel
                </Button>
              </Popconfirm>
              <Button 
                type="link" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleComplete(record.id)}
              >
                Complete
              </Button>
            </>
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
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      ) : (
        <div className="calendar-view">
          <p>Calendar view would show a weekly/daily schedule of OR bookings</p>
        </div>
      )}
    </>
  );
};

export default AllSchedulesTab;