// DiagnosisTable.js
import React from 'react';
import { Table, Button, Tag, Space, Tooltip, Popconfirm, Typography } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  BarcodeOutlined,
  ManOutlined, 
  WomanOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const DiagnosisTable = ({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  selectedRowKeys, 
  onRowSelection 
}) => {
  const columns = [
    {
      title: 'ICD-10 Code',
      dataIndex: 'icd_10_code',
      key: 'icd_10_code',
      width: 150,
      render: (code) => (
        <Tag icon={<BarcodeOutlined />} color="blue">
          {code}
        </Tag>
      ),
      sorter: (a, b) => a.icd_10_code?.localeCompare(b.icd_10_code),
    },
    {
      title: 'Diagnosis Name',
      dataIndex: 'diagnosis_name',
      key: 'diagnosis_name',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.diagnosis_name?.localeCompare(b.diagnosis_name),
    },
    {
      title: 'Gender Specificity',
      dataIndex: 'gender',
      key: 'gender',
      width: 150,
      render: (gender) => {
        if (gender === 'Male') {
          return (
            <Tag color="geekblue">
              <ManOutlined /> Male Specific
            </Tag>
          );
        } else if (gender === 'Female') {
          return (
            <Tag color="pink">
              <WomanOutlined /> Female Specific
            </Tag>
          );
        } else {
          return <Tag color="default">Not Specific</Tag>;
        }
      },
      filters: [
        { text: 'Male Specific', value: 'Male' },
        { text: 'Female Specific', value: 'Female' },
        { text: 'Not Specific', value: 'null' },
      ],
      onFilter: (value, record) => {
        if (value === 'null') return !record.gender;
        return record.gender === value;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Diagnosis">
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Diagnosis">
            <Popconfirm
              title="Are you sure you want to delete this diagnosis?"
              onConfirm={() => onDelete(record.id)}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Button 
                danger 
                size="small" 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
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
      rowSelection={rowSelection}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} diagnoses`,
      }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
};

export default DiagnosisTable;