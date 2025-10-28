// InvestigationTable.js
import React from 'react';
import { Table, Button, Popconfirm, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteLabInvestigation } from '../../../../../redux/slice/labInvestigationSlice';
import { message } from 'antd';

const InvestigationTable = ({ 
  data, 
  loading, 
  pagination, 
  onChange, 
  onEdit, 
  selectedRowKeys, 
  onRowSelection 
}) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteLabInvestigation(id))
      .then(() => {
        message.success('Lab investigation deleted successfully');
      })
      .catch(() => {
        message.error('Failed to delete lab investigation');
      });
  };

  const columns = [
    {
      title: 'Test Description',
      dataIndex: 'test_description',
      key: 'test_description',
      sorter: (a, b) => a.test_description.localeCompare(b.test_description),
    },
    {
      title: 'G-DRG Code',
      dataIndex: 'g_drg_code',
      key: 'g_drg_code',
      sorter: (a, b) => a.g_drg_code.localeCompare(b.g_drg_code),
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'NHIS Tariff (GHS)',
      dataIndex: 'tariff_ghc',
      key: 'tariff_ghc',
      sorter: (a, b) => a.tariff_ghc - b.tariff_ghc,
      render: (value) => `GHS ${value}`,
    },
    {
      title: 'Market Price (GHS)',
      dataIndex: 'market_price',
      key: 'market_price',
      sorter: (a, b) => (a.market_price || 0) - (b.market_price || 0),
      render: (value) => value ? `GHS ${value}` : '-',
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
            title="Are you sure to delete this investigation?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              icon={<DeleteOutlined />} 
              className="text-red-500"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onRowSelection,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      onChange={onChange}
      rowSelection={rowSelection}
      pagination={{
        current: pagination.currentPage,
        pageSize: pagination.limit,
        total: pagination.totalItems,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: true }}
      className="shadow-sm"
    />
  );
};

export default InvestigationTable;