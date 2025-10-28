// PatientsList.jsx
import React from 'react';
import { Card, List, Tag, Empty } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const PatientsList = ({ patients }) => {
  return (
    <Card title="Current Patients">
      <List
        dataSource={patients}
        renderItem={(patient) => (
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined className="text-2xl text-blue-500" />}
              title={`${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient'}
              description={
                <div className="space-y-1">
                  <Tag color="blue">Patient ID: {patient.patient_id || 'N/A'}</Tag>
                  {patient.admission_date && (
                    <div className="text-xs text-gray-500">
                      <CalendarOutlined /> Admitted: {new Date(patient.admission_date).toLocaleDateString()}
                    </div>
                  )}
                  {patient.attendance_number && (
                    <Tag color="green">Attendance: {patient.attendance_number}</Tag>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: <Empty description="No patients in this department" /> }}
      />
    </Card>
  );
};

export default PatientsList;