// Appointments.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllInstitutionAppointments } from '../../../redux/slice/createBookingSlice';
import { Tabs, Spin, Alert, Button, Row, Col } from 'antd';
import { CalendarOutlined, UnorderedListOutlined, ReloadOutlined } from '@ant-design/icons';
import CalendarView from './common/CalendarView';
import ListView from './common/ListView';
import AppointmentFilters from './common/AppointmentFilters';
import AppointmentStats from './common/AppointmentStats';

const { TabPane } = Tabs;

const Appointments = () => {
  const dispatch = useDispatch();
  const { institutionAppointments, loading, error } = useSelector(state => state.appointment);
  const [activeView, setActiveView] = useState('calendar');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    doctor: 'all'
  });

  React.useEffect(() => {
    dispatch(getAllInstitutionAppointments());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getAllInstitutionAppointments());
  };

  const filteredAppointments = institutionAppointments?.filter(appointment => {
    if (filters.status !== 'all' && appointment.status !== filters.status) return false;
    if (filters.doctor !== 'all' && appointment.staff_id !== filters.doctor) return false;
    // Add date range filtering logic here
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading appointments..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Appointments"
        description={error || 'Failed to load appointments. Please try again.'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <AppointmentStats appointments={institutionAppointments} />
      
      <AppointmentFilters 
        filters={filters} 
        setFilters={setFilters} 
        appointments={institutionAppointments}
      />

      <div className="bg-white rounded-lg shadow mt-6">
        <Tabs
          activeKey={activeView}
          onChange={setActiveView}
          type="card"
          className="px-4 pt-4"
        >
          <TabPane
            key="calendar"
            tab={
              <span>
                <CalendarOutlined />
                Calendar View
              </span>
            }
          >
            <CalendarView appointments={filteredAppointments} />
          </TabPane>
          <TabPane
            key="list"
            tab={
              <span>
                <UnorderedListOutlined />
                List View
              </span>
            }
          >
            <ListView appointments={filteredAppointments} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Appointments;