import React, { useState } from 'react';
import { Table, Select, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const SurgeonSchedulesTab = ({ 
  loading, 
  surgeonSchedules, 
  handleSurgeonChange 
}) => {
  const [selectedSurgeon, setSelectedSurgeon] = useState(null);

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      key: 'patient',
      render: (text) => (
        <Space>
          <UserOutlined />
          <span>{text || 'Unknown'}</span>
        </Space>
      ),
    },
    {
      title: 'Procedure',
      dataIndex: 'procedure',
      key: 'procedure',
    },
    {
      title: 'Date',
      dataIndex: 'scheduled_date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'scheduled_time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Select
          style={{ width: 300 }}
          placeholder="Select a surgeon"
          onChange={(value) => {
            setSelectedSurgeon(value);
            handleSurgeonChange(value);
          }}
          allowClear
        >
          <Option value="surgeon-1">Dr. Smith (Cardiothoracic)</Option>
          <Option value="surgeon-2">Dr. Johnson (Orthopedics)</Option>
          <Option value="surgeon-3">Dr. Lee (Neurosurgery)</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={surgeonSchedules}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default SurgeonSchedulesTab;