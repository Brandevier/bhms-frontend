// components/staff/StaffAppointments.js
import React, { useState } from 'react';
import { Card, List, Tag, Button, Modal, Typography, Timeline, Badge } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const StaffAppointments = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'in-progress': return 'orange';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Consultation': return 'purple';
      case 'Procedure': return 'cyan';
      case 'Surgery': return 'volcano';
      default: return 'default';
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  return (
    <Card 
      title={
        <span className="flex items-center">
          <CalendarOutlined className="mr-2 text-blue-500" />
          Upcoming Appointments
        </span>
      }
      className="mt-6"
      extra={
        <Button type="link" size="small">
          View All
        </Button>
      }
    >
      <List
        dataSource={appointments.slice(0, 5)}
        renderItem={(appointment) => (
          <List.Item
            actions={[
              <Button 
                type="link" 
                icon={<EyeOutlined />} 
                onClick={() => handleViewAppointment(appointment)}
                size="small"
              >
                View
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <div className="flex items-center">
                  <Text strong>{appointment.patientName}</Text>
                  <Tag color={getTypeColor(appointment.type)} className="ml-2">
                    {appointment.type}
                  </Tag>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-1 text-gray-400" />
                    <Text type="secondary">
                      {moment(appointment.date).format('MMM D, YYYY')} at {appointment.time}
                    </Text>
                  </div>
                  <div>
                    <Tag color={getStatusColor(appointment.status)}>
                      {appointment.status.toUpperCase()}
                    </Tag>
                    <Text type="secondary" className="ml-2">
                      {appointment.duration} • {appointment.department}
                    </Text>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Appointment Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={500}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Title level={5}>{selectedAppointment.patientName}</Title>
                <Text type="secondary">ID: {selectedAppointment.patientId}</Text>
              </div>
              <Tag color={getStatusColor(selectedAppointment.status)}>
                {selectedAppointment.status.toUpperCase()}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Date & Time</Text>
                <p>
                  {moment(selectedAppointment.date).format('MMM D, YYYY')} at {selectedAppointment.time}
                </p>
              </div>
              <div>
                <Text strong>Duration</Text>
                <p>{selectedAppointment.duration}</p>
              </div>
              <div>
                <Text strong>Type</Text>
                <p>
                  <Tag color={getTypeColor(selectedAppointment.type)}>
                    {selectedAppointment.type}
                  </Tag>
                </p>
              </div>
              <div>
                <Text strong>Department</Text>
                <p>{selectedAppointment.department}</p>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div>
                <Text strong>Notes</Text>
                <p className="bg-gray-50 p-3 rounded">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default StaffAppointments;