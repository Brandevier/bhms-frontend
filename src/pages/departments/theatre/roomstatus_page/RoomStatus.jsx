import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Spin, Empty, Tag, Statistic } from 'antd';
import { 
  getAllOperatingRooms, 
  getORStatistics,
  getAllTheatreBookings,
  startSurgery,
  completeSurgery,
  dischargeFromRecovery 
} from '../../../../redux/slice/theatreSlice';

import RoomGrid from './components/RoomGrid';
import StatusLegend from './components/StatusLegend';
import EnvironmentalControls from './components/EnvironmentalControls';
import StaffAssignment from './components/StaffAssignment';
import EquipmentStatus from './components/EquipmentStatus';

const RoomStatus = () => {
  const dispatch = useDispatch();
  const { operatingRooms, orStatistics, bookings, loading } = useSelector((state) => state.theatre);
  
  useEffect(() => {
    // Fetch operating rooms and statistics on mount
    dispatch(getAllOperatingRooms());
    dispatch(getORStatistics());
    // Fetch today's surgeries
    const today = new Date().toISOString().split('T')[0];
    dispatch(getAllTheatreBookings({ date: today }));
  }, [dispatch]);

  // Transform data for the UI components
  const rooms = operatingRooms.map(room => {
    // Find active surgery for this room
    const activeSurgery = bookings?.find(b => 
      b.room_id === room.id && 
      ['pre-operation', 'intra-operation', 'post-operation'].includes(b.status)
    );

    // Calculate elapsed time if surgery is in progress
    let timeElapsed = '';
    if (activeSurgery?.actual_start_time && activeSurgery?.status === 'intra-operation') {
      const start = new Date(activeSurgery.actual_start_time);
      const now = new Date();
      const diff = Math.floor((now - start) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      timeElapsed = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // Map room status
    let displayStatus = room.status;
    if (activeSurgery?.status === 'intra-operation') {
      displayStatus = 'in-progress';
    } else if (activeSurgery?.status === 'pre-operation') {
      displayStatus = 'prep';
    }

    return {
      id: room.id,
      name: room.room_name || `OR ${room.room_number}`,
      status: displayStatus,
      procedure: activeSurgery?.procedure_names?.[0] || '',
      timeElapsed: timeElapsed,
      staff: activeSurgery ? [
        activeSurgery.surgeon?.first_name + ' ' + activeSurgery.surgeon?.last_name,
        activeSurgery.anaesthetist?.first_name + ' ' + activeSurgery.anaesthetist?.last_name
      ].filter(Boolean) : [],
      equipment: room.equipment || [],
      temp: room.temperature || 22,
      humidity: room.humidity || 45,
      patient: activeSurgery?.patient ? {
        name: `${activeSurgery.patient.first_name} ${activeSurgery.patient.last_name}`,
        mrn: activeSurgery.patient.patient_id,
        surgeryStatus: activeSurgery.status
      } : null,
      surgeryId: activeSurgery?.id,
      actualStartTime: activeSurgery?.actual_start_time,
      estimatedDuration: activeSurgery?.estimated_duration,
      room: room
    };
  });

  // Statistics for display
  const stats = orStatistics || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Operating Room Status Dashboard</h1>
      
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic 
              title="Total Rooms" 
              value={stats.total || 0} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic 
              title="Available" 
              value={stats.available || 0} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic 
              title="In Use" 
              value={stats.occupied || 0} 
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic 
              title="Today's Surgeries" 
              value={stats.today_surgeries || 0} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <StatusLegend />
        </Col>
        
        <Col xs={24} lg={16}>
          {loading && rooms.length === 0 ? (
            <Card bordered={false} className="shadow-sm">
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            </Card>
          ) : rooms.length === 0 ? (
            <Card bordered={false} className="shadow-sm">
              <Empty description="No operating rooms found" />
            </Card>
          ) : (
            <RoomGrid rooms={rooms} />
          )}
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

