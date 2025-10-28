import React from 'react';
import { Badge, Select, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const ShiftBadge = ({ 
  shift, 
  record, 
  day, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onTempValueChange,
  tempValue 
}) => {
  const shiftTypes = ['Morning', 'Afternoon', 'Night', 'Off'];
  
  const getShiftColor = (shiftType) => {
    switch (shiftType) {
      case 'Morning': return 'blue';
      case 'Afternoon': return 'orange';
      case 'Night': return 'purple';
      case 'Off': return 'green';
      default: return 'default';
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center">
        <Select
          value={tempValue}
          style={{ width: 120 }}
          onChange={onTempValueChange}
          options={shiftTypes.map(type => ({ value: type, label: type }))}
        />
        <Space className="ml-2">
          <Button 
            type="link" 
            icon={<CheckOutlined className="text-green-500" />} 
            onClick={onSave}
            size="small"
          />
          <Button 
            type="link" 
            icon={<CloseOutlined className="text-red-500" />} 
            onClick={onCancel}
            size="small"
          />
        </Space>
      </div>
    );
  }
  
  return (
    <Badge 
      color={getShiftColor(shift)} 
      text={
        <span 
          className="cursor-pointer hover:underline"
          onClick={() => onEdit(record.id, day)}
        >
          {shift}
        </span>
      }
    />
  );
};

export default ShiftBadge;