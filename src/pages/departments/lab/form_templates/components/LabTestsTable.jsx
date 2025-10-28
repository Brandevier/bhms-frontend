import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Typography } from 'antd';
import { EditOutlined, EyeOutlined, ExperimentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const LabTestsTable = ({ tests, onEditTest, loading }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      completed: 'green',
      in_progress: 'blue',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      completed: 'Completed',
      in_progress: 'In Progress',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const columns = [
    {
      title: 'Test Description',
      dataIndex: ['template', 'description'],
      key: 'description',
      width: 250,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Code: {record.template?.lab_tarrif?.g_drg_code}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Price (GHC)',
      dataIndex: ['template', 'lab_tarrif', 'tariff_ghc'],
      key: 'price',
      width: 100,
      align: 'right',
      render: (price) => `₵${parseFloat(price || 0).toFixed(2)}`,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      render: (notes) => (
        <Tooltip title={notes}>
          <Text ellipsis style={{ maxWidth: 200 }}>
            {notes || 'No notes'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Results',
      key: 'results',
      width: 120,
      render: (_, record) => (
        <Text type={record.values ? 'success' : 'secondary'}>
          {record.values ? 'Available' : 'Not Available'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Results">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEditTest(record)}
              size="small"
              disabled={record.status === 'completed'}
            />
          </Tooltip>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => console.log('View details:', record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tests}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1000 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      locale={{
        emptyText: 'No lab tests found'
      }}
    />
  );
};

export default LabTestsTable;