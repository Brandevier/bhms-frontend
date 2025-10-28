import React from 'react';
import { Table, Tag } from 'antd';
import moment from 'moment'


const DiagnosisTable = ({ diagnosis }) => {
  const columns = [
    {
      title: 'Diagnosis',
      dataIndex: 'system_diagnosis',
      key: 'diagnosis',
      render: diag => diag?.name || 'N/A',
    },
    {
      title: 'Code',
      dataIndex: 'system_diagnosis',
      key: 'code',
      render: diag => diag?.code ? <Tag color="blue">{diag?.code}</Tag> : 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: date => moment(date).format('LLL'),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={diagnosis} 
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default DiagnosisTable;