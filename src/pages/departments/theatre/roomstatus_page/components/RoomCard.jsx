import React from 'react';
import { Card, Tag, List, Progress } from 'antd';
import TimerDisplay from './TimerDisplay';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  ToolOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

const statusColors = {
  'available': 'green',
  'in-progress': 'red',
  'cleaning': 'orange',
  'prep': 'blue',
  'occupied': 'red',
  'maintenance': 'default',
  'out_of_service': 'default'
};

const getStatusLabel = (status) => {
  switch(status) {
    case 'available': return 'Available';
    case 'in-progress': return 'In Progress';
    case 'cleaning': return 'Cleaning';
    case 'prep': return 'Pre-Op';
    case 'occupied': return 'Occupied';
    case 'maintenance': return 'Maintenance';
    case 'out_of_service': return 'Out of Service';
    default: return status;
  }
};

const RoomCard = ({ room }) => {
  const isInSurgery = room.status === 'in-progress';
  const isPrep = room.status === 'prep';
  const isCleaning = room.status === 'cleaning';

  const calculateProgress = () => {
    if (!room.actualStartTime || !room.estimatedDuration) return 0;
    const start = new Date(room.actualStartTime);
    const now = new Date();
    const elapsedMinutes = (now - start) / 1000 / 60;
    const progress = (elapsedMinutes / room.estimatedDuration) * 100;
    return Math.min(Math.round(progress), 100);
  };

  return (
    <Card 
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold">{room.name}</span>
          <Tag color={statusColors[room.status]} className="capitalize">
            {getStatusLabel(room.status)}
          </Tag>
        </div>
      }
      className="h-full"
    >
      {(isInSurgery || isPrep) && room.patient && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <UserOutlined className="mr-2 text-blue-600" />
            <span className="font-medium text-blue-900">{room.patient.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            MRN: {room.patient.mrn}
          </div>
          <div className="mt-2">
            <Tag 
              color={room.patient.surgeryStatus === 'intra-operation' ? 'red' : 'blue'}
              icon={<MedicineBoxOutlined />}
            >
              {room.patient.surgeryStatus === 'intra-operation' ? 'In Surgery' : 'Pre-Op'}
            </Tag>
          </div>
        </div>
      )}
      
      {isInSurgery && (
        <div className="mb-4">
          <div className="flex items-center text-gray-600 mb-2">
            <ClockCircleOutlined className="mr-2" />
            <span>Procedure Time</span>
          </div>
          <TimerDisplay timeElapsed={room.timeElapsed} />
          {room.procedure && (
            <div className="mt-2 text-sm font-medium text-gray-800">
              {room.procedure}
            </div>
          )}
          {room.estimatedDuration && (
            <Progress 
              percent={calculateProgress()} 
              status="active" 
              size="small"
              className="mt-2"
              format={() => `${room.estimatedDuration} min est.`}
            />
          )}
        </div>
      )}
      
      {isCleaning && (
        <div className="mb-4">
          <Progress 
            percent={room.timeElapsed ? (parseInt(room.timeElapsed.split(':')[1]) / 30 * 100) : 0} 
            status="active" 
            strokeColor="#fa8c16"
            format={() => `${room.timeElapsed || '00:00'} / 30:00`}
          />
          <div className="text-center text-gray-600 mt-2">Turnaround Cleaning</div>
        </div>
      )}
      
      {isPrep && (
        <div className="mb-4">
          <Progress 
            percent={10} 
            status="active" 
            strokeColor="#1890ff"
            size="small"
          />
          <div className="text-center text-gray-600 mt-2">Patient Preparation</div>
        </div>
      )}
      
      <List
        size="small"
        dataSource={[
          {
            icon: <TeamOutlined />,
            content: room.staff && room.staff.length > 0 
              ? room.staff.filter(Boolean).join(', ') 
              : 'No staff assigned'
          },
          {
            icon: <ToolOutlined />,
            content: room.equipment && room.equipment.length > 0 
              ? room.equipment.join(', ') 
              : 'No equipment in use'
          },
        ]}
        renderItem={item => (
          <List.Item>
            <div className="flex items-center">
              <span className="mr-2 text-gray-500">{item.icon}</span>
              <span className="text-sm">{item.content}</span>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RoomCard;
