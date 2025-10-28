import React from 'react';
import { Table, Tag, Space, Typography, Empty } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RecentClaimsTable = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <Empty description="No recent claims data available" />;
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'orange',
      'Approved': 'green',
      'Rejected': 'red',
      'Submitted': 'blue'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Claim Reference',
      dataIndex: 'claim_reference_number',
      key: 'claim_reference_number',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Patient',
      dataIndex: ['visit', 'patient'],
      key: 'patient',
      render: (patient) => (
        <Space>
          <UserOutlined className="text-gray-400" />
          <Text>{`${patient?.first_name || ''} ${patient?.last_name || ''}`}</Text>
        </Space>
      ),
    },
    {
      title: 'Attendance No.',
      dataIndex: ['visit', 'attendance_number'],
      key: 'attendance_number',
    },
    {
      title: 'Status',
      dataIndex: 'claim_status',
      key: 'claim_status',
      render: (status) => (
        <Tag color={getStatusColor(status)} className="font-semibold">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => (
        <Text strong className="text-green-600">
          ₵{parseFloat(amount || 0).toFixed(2)}
        </Text>
      ),
      align: 'right',
    },
    {
      title: 'Submission Date',
      dataIndex: 'submission_date',
      key: 'submission_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Items Count',
      key: 'items_count',
      render: (_, record) => (
        <Tag>
          {record.items?.length || 0} items
        </Tag>
      ),
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <EyeOutlined 
            className="text-blue-500 cursor-pointer hover:text-blue-700" 
            onClick={() => console.log('View claim:', record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        pageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} claims`,
      }}
      scroll={{ x: 800 }}
      className="rounded-lg"
    />
  );
};

export default RecentClaimsTable;