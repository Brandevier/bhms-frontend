import React from 'react';
import { Table, Tag } from 'antd';

const PrescriptionsTable = ({ prescriptions }) => {
  const columns = [
    {
      title: 'Medication',
      dataIndex: ['medicine', 'generic_name'],
      key: 'medicine',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
      render: (text, record) => `${text} ${record.doseUnitType}`,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: freq => `${freq}x/day`,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: dur => `${dur} days`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'dispensed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={prescriptions} 
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default PrescriptionsTable;