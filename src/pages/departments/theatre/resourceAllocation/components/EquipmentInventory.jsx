import React, { useState } from 'react';
import { Table, Tag, Input, Button, Space, Tooltip, Badge } from 'antd';
import { 
  SearchOutlined, 
  SyncOutlined, 
  WarningOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const EquipmentInventory = () => {
  const [searchText, setSearchText] = useState('');
  
  const equipmentData = [
    {
      key: '1',
      name: 'C-Arm X-Ray',
      id: 'XRAY-001',
      status: 'available',
      location: 'OR 1',
      lastMaintenance: '2023-05-15',
      nextMaintenance: '2023-08-15',
      maintenanceStatus: 'current'
    },
    {
      key: '2',
      name: 'Anesthesia Machine',
      id: 'ANES-003',
      status: 'in-use',
      location: 'OR 3',
      lastMaintenance: '2023-06-01',
      nextMaintenance: '2023-09-01',
      maintenanceStatus: 'current'
    },
    {
      key: '3',
      name: 'Surgical Table',
      id: 'TABLE-012',
      status: 'maintenance',
      location: 'Maintenance',
      lastMaintenance: '2022-12-10',
      nextMaintenance: '2023-03-10',
      maintenanceStatus: 'overdue'
    },
    // ... more equipment
  ];

  const columns = [
    {
      title: 'Equipment',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.id}</div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'available': { color: 'green', text: 'Available' },
          'in-use': { color: 'red', text: 'In Use' },
          'maintenance': { color: 'orange', text: 'Maintenance' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'In Use', value: 'in-use' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Maintenance',
      key: 'maintenance',
      render: (_, record) => (
        <Tooltip title={`Last: ${record.lastMaintenance} | Next: ${record.nextMaintenance}`}>
          <div className="flex items-center">
            {record.maintenanceStatus === 'overdue' ? (
              <Badge status="error" className="mr-2" />
            ) : (
              <Badge status="success" className="mr-2" />
            )}
            <span className={record.maintenanceStatus === 'overdue' ? 'text-red-500' : ''}>
              {record.nextMaintenance}
            </span>
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.nextMaintenance) - new Date(b.nextMaintenance),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button size="small">Details</Button>
          <Button size="small" type="link">Transfer</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search equipment..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button icon={<SyncOutlined />}>Refresh</Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={equipmentData.filter(item => 
          item.name.toLowerCase().includes(searchText.toLowerCase()) || 
          item.id.toLowerCase().includes(searchText.toLowerCase())
        )} 
        size="middle"
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default EquipmentInventory;