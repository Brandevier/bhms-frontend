import React from 'react';
import { Table, Button, Tag, Space, Popconfirm, Typography, Statistic } from 'antd';
import { EditOutlined, DeleteOutlined, BarcodeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteMedication } from '../../../../../redux/slice/nhia_medicationsSlice';

const { Text } = Typography;

const MedicationsTable = ({ medications, pagination, loading, onEdit, onFetchMedications }) => {
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code) => <Tag icon={<BarcodeOutlined />} color="blue">{code}</Tag>,
      sorter: (a, b) => a.code?.localeCompare(b.code),
    },
    {
      title: 'Generic Name',
      dataIndex: 'generic_name',
      key: 'generic_name',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.generic_name?.localeCompare(b.generic_name),
    },
    {
      title: 'Unit of Pricing',
      dataIndex: 'unit_of_pricing',
      key: 'unit_of_pricing',
      render: (text) => (
        <Space>
          {text ? (
            <Tag color="blue">{text}</Tag>
          ) : (
            <Text type="secondary">Not specified</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Market Price (GHS)',
      dataIndex: 'market_price',
      key: 'market_price',
      align: 'right',
      render: (price) => (
        <Statistic
          value={price || 0}
          precision={2}
          valueStyle={{ fontSize: 14 }}
        />
      ),
      sorter: (a, b) => (a.market_price || 0) - (b.market_price || 0),
    },
    {
      title: 'NHIA Price (GHS)',
      dataIndex: 'nhia_price',
      key: 'nhia_price',
      align: 'right',
      render: (price) => (
        <Statistic
          value={price || 0}
          precision={2}
          valueStyle={{ fontSize: 14, color: '#3f8600' }}
        />
      ),
      sorter: (a, b) => (a.nhia_price || 0) - (b.nhia_price || 0),
    },
    {
      title: 'NHIA Covered',
      dataIndex: 'is_nhia_covered',
      key: 'is_nhia_covered',
      width: 120,
      render: (covered) => (
        <Tag color={covered ? 'green' : 'red'}>
          {covered ? 'Covered' : 'Not Covered'}
        </Tag>
      ),
    },
    {
      title: 'Prescribing Level',
      dataIndex: 'level_of_prescribing',
      key: 'level_of_prescribing',
      width: 150,
      render: (level) => level ? <Tag color="geekblue">{level}</Tag> : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this medication?"
            onConfirm={() => dispatch(deleteMedication(record.id))}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={loading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={medications}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.currentPage,
        pageSize: pagination.pageSize,
        total: pagination.totalItems,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (page, pageSize) => {
          onFetchMedications({ page, pageSize });
        }
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default MedicationsTable;