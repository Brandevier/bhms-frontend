import React from 'react';
import { Table, Tag } from 'antd';

const LabTestsTable = ({ labTests }) => {
  const columns = [
    {
      title: 'Test',
      dataIndex: 'template',
      key: 'test',
      render: template => template?.lab_tarrif?.test_description || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={labTests} 
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default LabTestsTable;