import React from 'react';
import { Card, Tag, List, Progress } from 'antd';
import TimerDisplay from './TimerDisplay';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  ToolOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';

const statusColors = {
  'available': 'green',
  'in-progress': 'red',
  'cleaning': 'orange',
  'prep': 'blue'
};

const RoomCard = ({ room }) => {
  return (
    <Card 
      title={
        <div className="flex justify-between items-center">
          <span>{room.name}</span>
          <Tag color={statusColors[room.status]} className="capitalize">
            {room.status.replace('-', ' ')}
          </Tag>
        </div>
      }
      className="h-full"
    >
      {room.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex items-center text-gray-600 mb-1">
            <ClockCircleOutlined className="mr-2" />
            <span>Procedure Time</span>
          </div>
          <TimerDisplay timeElapsed={room.timeElapsed} />
          <div className="mt-1 text-sm font-medium">
            {room.procedure}
          </div>
        </div>
      )}
      
      {room.status === 'cleaning' && (
        <div className="mb-4">
          <Progress 
            percent={(parseInt(room.timeElapsed.split(':')[1]) / 30) * 100} 
            status="active" 
            format={() => `${room.timeElapsed} / 30:00`}
          />
          <div className="text-center text-gray-600">Turnaround Cleaning</div>
        </div>
      )}
      
      <List
        size="small"
        dataSource={[
          {
            icon: <TeamOutlined />,
            content: room.staff.length > 0 
              ? room.staff.join(', ') 
              : 'No staff assigned'
          },
          {
            icon: <ToolOutlined />,
            content: room.equipment.length > 0 
              ? room.equipment.join(', ') 
              : 'No equipment in use'
          },
        ]}
        renderItem={item => (
          <List.Item>
            <div className="flex items-center">
              <span className="mr-2">{item.icon}</span>
              {item.content}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RoomCard;