import React from 'react';
import { Card, Table, Progress } from 'antd';

const DepartmentAnalysisTab = ({ data }) => {
  const columns = [
    {
      title: 'Department',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Prescription Count',
      dataIndex: 'prescription_count',
      key: 'prescription_count'
    },
    {
      title: 'Emergency Cases',
      dataIndex: 'emergency_count',
      key: 'emergency_count'
    },
    {
      title: 'Percentage of Total',
      key: 'percentage',
      render: (record) => {
        const total = data.core?.total || 1;
        const percentage = (record.prescription_count / total) * 100;
        return (
          <Progress 
            percent={Math.round(percentage)} 
            size="small" 
            style={{ width: 100 }}
          />
        );
      }
    }
  ];

  return (
    <Card title="Department-wise Distribution">
      <Table
        dataSource={data.departments || []}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
};

export default DepartmentAnalysisTab;