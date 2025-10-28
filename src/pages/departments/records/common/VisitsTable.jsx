import React from 'react';
import { Table, Tag, Badge } from 'antd';

const VisitsTable = ({ visits }) => {
  const columns = [
    {
      title: 'Visit Date',
      dataIndex: 'visit_date',
      key: 'visit_date',
      render: date => new Date(date).toLocaleString(),
    },
    {
      title: 'Type',
      dataIndex: 'visit_type',
      key: 'visit_type',
      render: type => <Tag color={type === 'Outpatient' ? 'blue' : 'purple'}>{type}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Badge 
          status={status === 'Active' ? 'success' : 'default'} 
          text={status} 
        />
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: dept => dept?.name || 'N/A',
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={visits} 
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default VisitsTable;