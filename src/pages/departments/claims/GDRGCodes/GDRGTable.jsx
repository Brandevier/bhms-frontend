import React from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const GDRGTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Tag color="blue">{text}</Tag>,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      sorter: (a, b) => a.condition.localeCompare(b.condition),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Market Price (GHS)',
      dataIndex: 'market_price',
      key: 'market_price',
      render: (price) => `GHS ${price.toFixed(2)}`,
      sorter: (a, b) => a.market_price - b.market_price,
    },
    {
      title: 'NHIA Price (GHS)',
      dataIndex: 'nhia_price',
      key: 'nhia_price',
      render: (price) => `GHS ${price.toFixed(2)}`,
      sorter: (a, b) => a.nhia_price - b.nhia_price,
    },
    {
      title: 'NHIA Covered',
      dataIndex: 'is_nhia_covered',
      key: 'is_nhia_covered',
      render: (covered) => (
        <Tag color={covered ? 'green' : 'red'}>
          {covered ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            className="text-blue-500"
          />
          <Popconfirm
            title="Are you sure to delete this code?"
            onConfirm={() => onDelete(record.code)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              className="text-red-500"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="code"
      loading={loading}
      pagination={false}
      className="mb-4"
      scroll={{ x: true }}
    />
  );
};

export default GDRGTable;