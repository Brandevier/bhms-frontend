// CalendarView.jsx
import React from 'react';
import { Calendar, Badge, Modal } from 'antd';
import moment from 'moment';

const CalendarView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  
  const getListData = (value) => {
    return appointments.filter(appointment => {
      const appointmentDate = moment(appointment.appointment_date);
      return (
        appointmentDate.date() === value.date() &&
        appointmentDate.month() === value.month() &&
        appointmentDate.year() === value.year()
      );
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge 
              status={getStatusType(item.status)} 
              text={
                <span 
                  className="text-xs cursor-pointer hover:underline"
                  onClick={() => setSelectedAppointment(item)}
                >
                  {formatTime(item.appointment_time)} - {getPatientName(item)}
                </span>
              } 
            />
          </li>
        ))}
      </ul>
    );
  };

  const getPatientName = (appointment) => {
    if (appointment.patient?.patient?.first_name && appointment.patient?.patient?.last_name) {
      return `${appointment.patient.patient.first_name} ${appointment.patient.patient.last_name}`;
    }
    return 'Unknown Patient';
  };

  const getDoctorName = (appointment) => {
    if (appointment.doctor?.firstName && appointment.doctor?.lastName) {
      return `${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
    }
    return 'Unknown Doctor';
  };

  const getStatusType = (status) => {
    switch (status) {
      case 'scheduled': return 'processing';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return moment(timeString, 'HH:mm:ss').format('h:mm A');
  };

  return (
    <div className="p-4">
      <Calendar dateCellRender={dateCellRender} />
      
      <Modal
        title="Appointment Details"
        open={!!selectedAppointment}
        onCancel={() => setSelectedAppointment(null)}
        footer={null}
      >
        {selectedAppointment && (
          <div className="space-y-3">
            <div>
              <strong>Patient:</strong> {getPatientName(selectedAppointment)}
            </div>
            <div>
              <strong>Date:</strong> {moment(selectedAppointment.appointment_date).format('MMMM Do, YYYY')}
            </div>
            <div>
              <strong>Time:</strong> {formatTime(selectedAppointment.appointment_time)}
            </div>
            <div>
              <strong>Doctor:</strong> {getDoctorName(selectedAppointment)}
            </div>
            <div>
              <strong>Type:</strong> {selectedAppointment.appointment_type || 'N/A'}
            </div>
            <div>
              <strong>Status:</strong> 
              <Badge 
                status={getStatusType(selectedAppointment.status)} 
                text={selectedAppointment.status} 
                className="ml-2"
              />
            </div>
            <div>
              <strong>Reason:</strong> {selectedAppointment.reason || 'N/A'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;