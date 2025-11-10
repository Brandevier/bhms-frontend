import React from 'react';
import { Space, Badge, Tag, Button } from 'antd';
import { UserOutlined, MedicineBoxOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';

const PatientHeader = ({ patient }) => {
  const patientName = patient.patient?.name || 'Unknown Patient';
  const primaryProcedure = patient.procedure?.primary || 'No procedure specified';
  const surgeryDate = patient.schedule?.formattedDate || 'Not scheduled';
  const surgeryTime = patient.schedule?.formattedTime || '';
  const patientAge = patient.patient?.age || 'N/A';
  const patientGender = patient.patient?.gender || 'N/A';
  const folderNumber = patient.patient?.folderNumber || 'N/A';
  const isEmergency = patient.is_emergency || false;

  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center">
          <UserOutlined className="mr-3 text-blue-600" />
          Nursing Documentation
        </h2>
        <div className="mt-2 space-y-1 text-gray-600">
          <div className="flex items-center">
            <span className="font-medium">{patientName}</span>
            <Badge 
              count={folderNumber} 
              style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
            />
            {isEmergency && (
              <Tag color="red" className="ml-2">Emergency</Tag>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Age: {patientAge}</span>
            <span>Gender: {patientGender}</span>
          </div>
          <div className="flex items-center">
            <MedicineBoxOutlined className="mr-2" />
            <span>{primaryProcedure}</span>
          </div>
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            <span>
              {surgeryDate} 
              {surgeryTime && ` at ${surgeryTime}`}
            </span>
          </div>
        </div>
      </div>
      
      <Button type="primary" size="large" icon={<FileTextOutlined />}>
        Complete Assessment
      </Button>
    </div>
  );
};

export default PatientHeader;