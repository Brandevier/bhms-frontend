import React from 'react';
import { Tag, Badge } from 'antd';
import { 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import moment from 'moment';

const AppointmentStatusBadge = ({ appointment }) => {
  const isPastAppointment = moment(`${appointment.appointment_date} ${appointment.appointment_time}`).isBefore(moment());
  
  const getStatusConfig = () => {
    if (isPastAppointment && appointment.status?.toLowerCase() !== 'completed') {
      return {
        color: 'red',
        icon: <ExclamationCircleOutlined />,
        text: 'Missed',
        type: 'missed'
      };
    }

    switch(appointment.status?.toLowerCase()) {
      case 'completed':
        return { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed', type: 'completed' };
      case 'canceled':
        return { color: 'red', icon: <ExclamationCircleOutlined />, text: 'Canceled', type: 'canceled' };
      case 'confirmed':
        return { color: 'purple', icon: <CheckCircleOutlined />, text: 'Confirmed', type: 'confirmed' };
      case 'scheduled':
      default:
        return { color: 'blue', icon: <ClockCircleOutlined />, text: 'Scheduled', type: 'scheduled' };
    }
  };

  const getTimingBadge = () => {
    const appointmentDateTime = moment(`${appointment.appointment_date} ${appointment.appointment_time}`);
    const now = moment();
    const diffMinutes = appointmentDateTime.diff(now, 'minutes');
    
    if (diffMinutes <= 30 && diffMinutes > 0) {
      return { color: 'gold', text: 'Due Soon', icon: <FieldTimeOutlined /> };
    }
    if (diffMinutes <= 120 && diffMinutes > 0) {
      return { color: 'cyan', text: 'Upcoming', icon: <ClockCircleOutlined /> };
    }
    return null;
  };

  const statusConfig = getStatusConfig();
  const timingBadge = getTimingBadge();

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag 
        icon={statusConfig.icon} 
        color={statusConfig.color}
        style={{ margin: 0, fontWeight: 500, borderRadius: 12 }}
      >
        {statusConfig.text}
      </Tag>
      {timingBadge && (
        <Tag 
          icon={timingBadge.icon}
          color={timingBadge.color}
          style={{ margin: 0, borderRadius: 12 }}
        >
          {timingBadge.text}
        </Tag>
      )}
    </div>
  );
};

export default AppointmentStatusBadge;