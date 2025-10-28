import React from 'react';
import { Card, Table, Tag } from 'antd';

const DrugAnalysisTab = ({ data }) => {
  const columns = [
    {
      title: 'Medication',
      dataIndex: 'medicine',
      key: 'medicine',
      render: (medicine) => medicine?.generic_name || 'Unknown'
    },
    {
      title: 'Code',
      dataIndex: 'medicine',
      key: 'code',
      render: (medicine) => medicine?.code || '-'
    },
    {
      title: 'Prescription Count',
      dataIndex: 'prescription_count',
      key: 'prescription_count'
    },
    {
      title: 'Total Quantity',
      dataIndex: 'total_quantity',
      key: 'total_quantity'
    },
    {
      title: 'NHIA Covered',
      dataIndex: 'medicine',
      key: 'nhia',
      render: (medicine) => (
        <Tag color={medicine?.is_nhia_covered ? 'green' : 'red'}>
          {medicine?.is_nhia_covered ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Price (NHIA)',
      dataIndex: 'medicine',
      key: 'price',
      render: (medicine) => `₵${medicine?.nhia_price || 0}`
    }
  ];

  return (
    <Card title="Top Prescribed Medications">
      <Table
        dataSource={data.top_medications || []}
        columns={columns}
        rowKey="medication_id"
        pagination={false}
      />
    </Card>
  );
};

export default DrugAnalysisTab;