import React, { useState } from 'react';
import { Transfer, Table, Tag, Select, Divider } from 'antd';
import { 
  UserOutlined,
  TeamOutlined,
  ScheduleOutlined
} from '@ant-design/icons';

const { Option } = Select;

const StaffAssignmentTool = () => {
  const [targetKeys, setTargetKeys] = useState(['1', '4']);
  const [selectedTeam, setSelectedTeam] = useState('cardiac');
  
  const staffData = [
    {
      key: '1',
      name: 'Dr. Smith',
      role: 'Surgeon',
      specialty: 'cardiac',
      availability: 'high',
    },
    {
      key: '2',
      name: 'Dr. Johnson',
      role: 'Surgeon',
      specialty: 'orthopedic',
      availability: 'medium',
    },
    {
      key: '3',
      name: 'Dr. Lee',
      role: 'Anesthesiologist',
      specialty: 'general',
      availability: 'high',
    },
    {
      key: '4',
      name: 'Nurse Brown',
      role: 'Scrub Nurse',
      specialty: 'cardiac',
      availability: 'high',
    },
    // ... more staff
  ];

  const teamTypes = [
    { value: 'cardiac', label: 'Cardiac Team' },
    { value: 'orthopedic', label: 'Orthopedic Team' },
    { value: 'neuro', label: 'Neuro Team' },
    { value: 'general', label: 'General Surgery' },
  ];

  const filterOption = (inputValue, option) => 
    option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const leftTableColumns = [
    {
      dataIndex: 'name',
      title: 'Name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.role}</div>
        </div>
      ),
    },
    {
      dataIndex: 'specialty',
      title: 'Specialty',
      render: (specialty) => <Tag color="blue">{specialty}</Tag>,
    },
  ];

  const rightTableColumns = [
    {
      dataIndex: 'name',
      title: 'Assigned Staff',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.role}</div>
        </div>
      ),
    },
    {
      dataIndex: 'availability',
      title: 'Availability',
      render: (availability) => {
        const availabilityMap = {
          'high': { color: 'green', text: 'High' },
          'medium': { color: 'orange', text: 'Medium' },
          'low': { color: 'red', text: 'Low' },
        };
        return <Tag color={availabilityMap[availability].color}>{availabilityMap[availability].text}</Tag>;
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center mb-4">
        <TeamOutlined className="mr-2 text-lg" />
        <Select
          defaultValue="cardiac"
          style={{ width: 200 }}
          onChange={setSelectedTeam}
        >
          {teamTypes.map(team => (
            <Option key={team.value} value={team.value}>{team.label}</Option>
          ))}
        </Select>
        <Divider type="vertical" />
        <ScheduleOutlined className="mr-2 text-lg" />
        <span className="text-gray-600">Next case: Cardiac Bypass (08:30 AM)</span>
      </div>
      
      <Transfer
        dataSource={staffData.filter(staff => staff.specialty === selectedTeam)}
        targetKeys={targetKeys}
        onChange={handleChange}
        filterOption={filterOption}
        showSearch
        listStyle={{
          width: '45%',
          height: 400,
        }}
        operations={['Assign to case', 'Remove from case']}
      >
        {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys }) => {
          const columns = direction === 'left' ? leftTableColumns : rightTableColumns;
          
          return (
            <Table
              rowSelection={{
                selectedRowKeys: selectedKeys,
                onSelectAll: (selected, selectedRows) => {
                  onItemSelectAll(selectedRows.map(item => item.key), selected);
                },
                onSelect: (record, selected) => {
                  onItemSelect(record.key, selected);
                },
              }}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: direction === 'right' ? 'none' : null }}
              onRow={(record) => ({
                onClick: () => {
                  if (direction === 'left') {
                    onItemSelect(record.key, !selectedKeys.includes(record.key));
                  }
                },
              })}
              pagination={false}
            />
          );
        }}
      </Transfer>
    </div>
  );
};

export default StaffAssignmentTool;