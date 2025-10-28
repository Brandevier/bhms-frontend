import React from 'react';
import { Table, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ShiftBadge from './ShiftBadge';

const ShiftTable = ({ 
  shifts, 
  daysOfWeek, 
  editingId, 
  editingField, 
  tempValue, 
  onEdit, 
  onSave, 
  onCancel, 
  onTempValueChange 
}) => {
  
  const columns = [
    {
      title: 'Staff Member',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.position}</div>
        </div>
      ),
    },
    ...daysOfWeek.map(day => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (shift, record) => (
        <ShiftBadge
          shift={shift}
          record={record}
          day={day}
          isEditing={editingId === record.id && editingField === day}
          onEdit={onEdit}
          onSave={() => onSave(record.id)}
          onCancel={onCancel}
          onTempValueChange={onTempValueChange}
          tempValue={tempValue}
        />
      ),
    })),
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EditOutlined />}
          onClick={() => onEdit(record.id, 'Monday')}
        />
      ),
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={shifts}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      pagination={false}
      bordered
    />
  );
};

export default ShiftTable;