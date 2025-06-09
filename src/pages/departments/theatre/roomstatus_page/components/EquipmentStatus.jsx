import React from 'react';
import { Card, Tag } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const EquipmentStatus = ({ rooms }) => {
  const equipmentData = rooms
    .filter(room => room.equipment.length > 0)
    .flatMap(room => 
      room.equipment.map(item => ({ room: room.name, item })))
    .slice(0, 8); // Limit to 8 for display

  return (
    <Card 
      title={
        <div className="flex items-center">
          <ToolOutlined className="mr-2" />
          <span>Equipment in Use</span>
        </div>
      } 
      bordered={false} 
      className="shadow-sm"
    >
      <div className="flex flex-wrap gap-2">
        {equipmentData.length > 0 ? (
          equipmentData.map((eq, index) => (
            <Tag key={index} color="blue">
              {eq.item} <span className="text-gray-500 ml-1">({eq.room})</span>
            </Tag>
          ))
        ) : (
          <div className="text-gray-500 text-center py-2 w-full">
            No equipment currently in use
          </div>
        )}
      </div>
    </Card>
  );
};

export default EquipmentStatus;