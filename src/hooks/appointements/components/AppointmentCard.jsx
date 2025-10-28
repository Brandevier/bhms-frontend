import React from 'react';
import { Card, Typography, Space, Button, Popconfirm, Tooltip } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  DeleteOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import moment from 'moment';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import AppointmentTypeTag from './AppointmentTypeTag';

const { Text, Title } = Typography;

const AppointmentCard = ({ appointment, onDelete }) => {
  const appointmentDateTime = moment(`${appointment.appointment_date} ${appointment.appointment_time}`);
  const isPast = appointmentDateTime.isBefore(moment());

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: 12,
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      marginBottom: 12
    };

    if (isPast && appointment.status?.toLowerCase() !== 'completed') {
      return { ...baseStyle, background: '#fff2f0', borderColor: '#ffccc7' };
    }

    const diffMinutes = appointmentDateTime.diff(moment(), 'minutes');
    if (diffMinutes <= 30 && diffMinutes > 0) {
      return { ...baseStyle, background: '#fff7e6', borderColor: '#ffd591' };
    }
    if (diffMinutes <= 120 && diffMinutes > 0) {
      return { ...baseStyle, background: '#f6ffed', borderColor: '#b7eb8f' };
    }
    if (appointment.status?.toLowerCase() === 'completed') {
      return { ...baseStyle, background: '#f6ffed', borderColor: '#b7eb8f' };
    }

    return { ...baseStyle, background: '#fafafa' };
  };

  return (
    <Card 
      size="small"
      style={getCardStyle()}
      bodyStyle={{ padding: '16px' }}
      hoverable
      onClick={() => console.log('View appointment details:', appointment.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <Space direction="vertical" size="small" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined style={{ color: '#1890ff' }} />
            <Text strong style={{ fontSize: '14px' }}>
              {appointmentDateTime.format('ddd, MMM D, YYYY')}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClockCircleOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: '13px' }}>
              {appointmentDateTime.format('h:mm A')}
            </Text>
          </div>
        </Space>
        
        <AppointmentStatusBadge appointment={appointment} />
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* Doctor Information */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <UserOutlined style={{ color: '#722ed1' }} />
            <Text style={{ fontSize: '13px' }}>
              Dr. {appointment.staff?.firstName} {appointment.staff?.lastName}
            </Text>
          </Space>
          <AppointmentTypeTag type={appointment.appointment_type} />
        </div>

        {/* Location */}
        {appointment.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EnvironmentOutlined style={{ color: '#fa8c16' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {appointment.location}
            </Text>
          </div>
        )}

        {/* Reason */}
        {appointment.reason && (
          <div>
            <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
              {appointment.reason}
            </Text>
          </div>
        )}

        {/* Actions */}
        {!isPast && appointment.status?.toLowerCase() !== 'completed' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Popconfirm
              title="Delete Appointment"
              description="Are you sure you want to delete this appointment?"
              onConfirm={() => onDelete(appointment.id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Tooltip title="Delete appointment">
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  size="small" 
                  danger
                  style={{ borderRadius: 6 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default AppointmentCard;