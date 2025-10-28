import React from 'react';
import { Row, Col, Card } from 'antd';
// import {
//   RoomGrid,
//   StatusLegend,
//   EnvironmentalControls,
//   StaffAssignment,
//   EquipmentStatus
// } from '@/components/RoomStatus';

import RoomGrid from './components/RoomGrid';
import StatusLegend from './components/StatusLegend';
import EnvironmentalControls from './components/EnvironmentalControls';
import StaffAssignment from './components/StaffAssignment';
import EquipmentStatus from './components/EquipmentStatus';


const RoomStatus = () => {
  // Mock data - replace with real API calls
  const rooms = [
    { id: 1, name: 'OR 1', status: 'in-progress', procedure: 'Knee Replacement', timeElapsed: '02:15', staff: ['Dr. Smith', 'Dr. Johnson'], equipment: ['C-Arm', 'Monitor'], temp: 22, humidity: 45 },
    { id: 2, name: 'OR 2', status: 'cleaning', procedure: '', timeElapsed: '00:25', staff: [], equipment: [], temp: 21, humidity: 50 },
    { id: 3, name: 'OR 3', status: 'available', procedure: '', timeElapsed: '', staff: [], equipment: [], temp: 20, humidity: 48 },
    { id: 4, name: 'OR 4', status: 'prep', procedure: 'Appendectomy', timeElapsed: '00:10', staff: ['Dr. Lee'], equipment: ['Laparoscope'], temp: 22, humidity: 47 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Operating Room Status Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <StatusLegend />
        </Col>
        
        <Col xs={24} lg={16}>
          <RoomGrid rooms={rooms} />
        </Col>
        
        <Col xs={24} lg={8}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <EnvironmentalControls rooms={rooms} />
            </Col>
            <Col span={24}>
              <StaffAssignment rooms={rooms} />
            </Col>
            <Col span={24}>
              <EquipmentStatus rooms={rooms} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default RoomStatus;