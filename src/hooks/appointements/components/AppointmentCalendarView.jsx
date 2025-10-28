import React from 'react';
import { Calendar, Badge, Typography } from 'antd';
import moment from 'moment';
import AppointmentTypeTag from './AppointmentTypeTag';

const { Text } = Typography;

const AppointmentCalendarView = ({ appointments, onSelectDate }) => {
  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return appointments.filter(appt => 
      moment(appt.appointment_date).format('YYYY-MM-DD') === dateStr
    );
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    
    return (
      <div style={{ minHeight: 80, padding: 4 }}>
        {listData.map((appointment, index) => (
          <div
            key={appointment.id}
            style={{
              background: '#1890ff',
              color: 'white',
              borderRadius: 4,
              padding: '2px 4px',
              marginBottom: 2,
              fontSize: '10px',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            onClick={() => onSelectDate(appointment)}
            title={`${moment(appointment.appointment_time, 'HH:mm:ss').format('h:mm A')} - ${appointment.reason || 'Appointment'}`}
          >
            {moment(appointment.appointment_time, 'HH:mm:ss').format('h:mm A')}
          </div>
        ))}
      </div>
    );
  };

  const getMonthData = (value) => {
    const monthStr = value.format('YYYY-MM');
    const monthAppointments = appointments.filter(appt => 
      moment(appt.appointment_date).format('YYYY-MM') === monthStr
    );
    return monthAppointments.length > 0 ? monthAppointments.length : null;
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div style={{ textAlign: 'center' }}>
        <Badge count={num} style={{ backgroundColor: '#52c41a' }} />
      </div>
    ) : null;
  };

  return (
    <Calendar
      dateCellRender={dateCellRender}
      monthCellRender={monthCellRender}
      style={{ 
        borderRadius: 12,
        padding: 16,
        background: 'white'
      }}
      onSelect={(date) => {
        const dateAppointments = getListData(date);
        if (dateAppointments.length > 0) {
          console.log('Selected date with appointments:', date.format('YYYY-MM-DD'));
        }
      }}
    />
  );
};

export default AppointmentCalendarView;