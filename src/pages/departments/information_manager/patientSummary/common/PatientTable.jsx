// PatientTable.jsx
import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment'


const PatientTable = ({ data, type }) => {
  const columns = [
   
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'blue' : 'pink'}>
          {gender}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag color={type === 'inpatient' ? 'green' : 'orange'}>
          {type === 'inpatient' ? 'Inpatient' : 'Outpatient'}
        </Tag>
      ),
    },
  ];

  const handleDownload = () => {
    console.log(`Download ${type} data as Excel`);
    // Excel download implementation will go here
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleDownload}
        >
          Export to Excel
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default PatientTable;