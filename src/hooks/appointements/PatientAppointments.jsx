import React, { useState } from 'react';
import { Card, Tabs, Typography, Space, Empty, Button } from 'antd';
import { 
  CalendarOutlined, 
  UnorderedListOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
// import { deleteAppointment } from '../redux/slice/createBookingSlice';
import { deleteAppointment } from '../../redux/slice/createBookingSlice';
import moment from 'moment';



// Import components
import AppointmentCard from './components/AppointmentCard';
import AppointmentCalendarView from './components/AppointmentCalendarView';


const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PatientAppointments = ({ appointments }) => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState('list');
  const [selectedDate, setSelectedDate] = useState(null);

  // Sort appointments by date (soonest first)
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.appointment_date) - new Date(b.appointment_date)
  );

  // Filter appointments (upcoming, past, etc.)
  const upcomingAppointments = sortedAppointments.filter(appt => 
    moment(`${appt.appointment_date} ${appt.appointment_time}`).isAfter(moment())
  );

  const pastAppointments = sortedAppointments.filter(appt => 
    moment(`${appt.appointment_date} ${appt.appointment_time}`).isBefore(moment())
  );

  const handleDeleteAppointment = (appointmentId) => {
    dispatch(deleteAppointment(appointmentId))
      .unwrap()
      .then(() => {
        console.log('Appointment deleted successfully');
      })
      .catch((error) => {
        console.error('Failed to delete appointment:', error);
      });
  };

  const handleSelectDate = (appointment) => {
    console.log('Selected appointment:', appointment);
    // You can open a modal or navigate to appointment details
  };

  const EmptyState = ({ message, description }) => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Space direction="vertical" size="small">
          <Text type="secondary">{message}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {description}
          </Text>
        </Space>
      }
      style={{ padding: '40px 0' }}
    >
      <Button type="primary" icon={<PlusOutlined />}>
        Schedule Appointment
      </Button>
    </Empty>
  );

  return (
    <Card 
      style={{ 
        borderRadius: 16,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: 'none'
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div style={{ 
        padding: '20px 24px 0', 
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px 16px 0 0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <CalendarOutlined style={{ color: 'white', fontSize: '20px' }} />
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              Patient Appointments
            </Title>
          </Space>
          <Space>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              Total: {appointments.length}
            </Text>
          </Space>
        </div>

        <Tabs
          activeKey={activeView}
          onChange={setActiveView}
          style={{ marginBottom: '-1px' }}
          items={[
            {
              key: 'list',
              label: (
                <Space>
                  <UnorderedListOutlined />
                  List View
                  <Text style={{ color: '#1890ff' }}>({upcomingAppointments.length})</Text>
                </Space>
              ),
            },
            {
              key: 'calendar',
              label: (
                <Space>
                  <CalendarOutlined />
                  Calendar View
                </Space>
              ),
            },
          ]}
        />
      </div>

      {/* Content */}
      <div style={{ padding: 24, minHeight: 400 }}>
        {activeView === 'list' ? (
          <div>
            {upcomingAppointments.length > 0 ? (
              <div>
                <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
                  Upcoming Appointments ({upcomingAppointments.length})
                </Title>
                {upcomingAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onDelete={handleDeleteAppointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                message="No upcoming appointments"
                description="Schedule new appointments to see them here"
              />
            )}

            {pastAppointments.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <Title level={5} style={{ marginBottom: 16, color: '#999' }}>
                  Past Appointments ({pastAppointments.length})
                </Title>
                {pastAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onDelete={handleDeleteAppointment}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <AppointmentCalendarView
            appointments={sortedAppointments}
            onSelectDate={handleSelectDate}
          />
        )}
      </div>
    </Card>
  );
};

export default PatientAppointments;