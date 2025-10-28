import React from 'react';
import { Table, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ShiftTable = ({ staffData, loading, onShowQr }) => {
  const renderShiftTag = (shift) => {
    if (!shift) return '-';

    const shiftConfig = {
      morning: { color: 'blue', className: 'bg-blue-100 text-blue-800' },
      afternoon: { color: 'orange', className: 'bg-orange-100 text-orange-800' },
      night: { color: 'purple', className: 'bg-purple-100 text-purple-800' },
      off: { color: 'green', className: 'bg-green-100 text-green-800' }
    };

    const config = shiftConfig[shift.toLowerCase()] || { 
      color: 'default', 
      className: 'bg-gray-100 text-gray-800' 
    };

    return (
      <Tag color={config.color} className={`${config.className} px-3 py-1 rounded-full font-medium capitalize`}>
        {shift}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Staff Member',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 220,
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={record.photo}
            icon={<UserOutlined />}
            size="large"
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{text}</span>
            <span className="text-gray-500 text-sm">{record.position}</span>
            <span className="text-gray-400 text-xs">{record.employeeId}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Mon',
      dataIndex: ['schedule', 'monday'],
      key: 'monday',
      render: renderShiftTag,
      align: 'center',
    },
    {
      title: 'Tue',
      dataIndex: ['schedule', 'tuesday'],
      key: 'tuesday',
      render: renderShiftTag,
      align: 'center',
    },
    {
      title: 'Wed',
      dataIndex: ['schedule', 'wednesday'],
      key: 'wednesday',
      render: renderShiftTag,
      align: 'center',
    },
    {
      title: 'Thu',
      dataIndex: ['schedule', 'thursday'],
      key: 'thursday',
      render: renderShiftTag,
      align: 'center',
    },
    {
      title: 'Fri',
      dataIndex: ['schedule', 'friday'],
      key: 'friday',
      render: renderShiftTag,
      align: 'center',
    },
    {
      title: 'Sat',
      dataIndex: ['schedule', 'saturday'],
      key: 'saturday',
      render: renderShiftTag,
      align: 'center',
    },
    {
      title: 'Sun',
      dataIndex: ['schedule', 'sunday'],
      key: 'sunday',
      render: renderShiftTag,
      align: 'center',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={staffData}
      scroll={{ x: 'max-content' }}
      rowKey="id"
      pagination={false}
      loading={loading}
      className="mt-6 shadow-sm rounded-lg overflow-hidden"
      rowClassName="hover:bg-gray-50 transition-colors duration-200"
    />
  );
};

export default ShiftTable;