import React from 'react';
import { Table, Input, InputNumber, Tag, Space, Typography, Tooltip } from 'antd';
import { WarningOutlined, QuestionOutlined } from '@ant-design/icons';

const { Text } = Typography;

const VettingTable = ({ data, validationDetails, isEditing, onDataChange }) => {
  const columns = [
    {
      title: 'Claim ID',
      dataIndex: 'claimId',
      key: 'claimId',
      width: 120,
      render: (claimId) => <Text code>{claimId}</Text>
    },
    {
      title: 'Member',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 150,
      ellipsis: true
    },
    {
      title: 'Service Code',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: 120,
      render: (code) => <Text strong>{code}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (desc) => desc || 'No description'
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center',
      render: (quantity) => quantity || 1
    },
    {
      title: 'Unit Price (₵)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right',
      render: (price) => `₵${parseFloat(price || 0).toFixed(2)}`
    },
    {
      title: 'Total (₵)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'right',
      render: (amount) => `₵${parseFloat(amount || 0).toFixed(2)}`
    },
    {
      title: 'NHIA (₵)',
      dataIndex: 'nhiaAmount',
      key: 'nhiaAmount',
      width: 120,
      align: 'right',
      render: (amount) => `₵${parseFloat(amount || 0).toFixed(2)}`
    },
    {
      title: 'Patient (₵)',
      dataIndex: 'patientAmount',
      key: 'patientAmount',
      width: 120,
      align: 'right',
      render: (amount) => `₵${parseFloat(amount || 0).toFixed(2)}`
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tag color={record.validation?.isValid ? 'green' : 'red'}>
          {record.validation?.isValid ? 'PASS' : 'FAIL'}
        </Tag>
      )
    },
    {
      title: 'Issues',
      key: 'issues',
      width: 200,
      render: (_, record) => {
        if (!record.validation?.issues || record.validation.issues.length === 0) {
          return <Tag color="green">No issues</Tag>;
        }
        
        return (
          <Tooltip 
            title={record.validation.issues.join(', ')} 
            placement="topLeft"
          >
            <Space>
              <WarningOutlined style={{ color: '#ff4d4f' }} />
              <Text type="danger">{record.validation.issues.length} issue(s)</Text>
            </Space>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="serviceId"
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} services`
      }}
      scroll={{ x: 1200 }}
      size="middle"
      rowClassName={(record) => 
        record.validation?.isValid ? 'validation-pass' : 'validation-fail'
      }
    />
  );
};

export default VettingTable;