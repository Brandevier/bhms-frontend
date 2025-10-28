import React from 'react';
import { Card, Avatar, Tag, Space, Button, Divider, Badge } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AdmissionActions from './AdmissionActions';
import { getStatusTag } from './utils';

const AdmissionCard = ({ admission, onViewDetails, user }) => {
  return (
    <Card className="admission-card" hoverable>
      <div className="card-content">
        <div className="patient-info">
          <Avatar 
            size={64} 
            icon={<UserOutlined />} 
            src={admission.patient?.profile_pic}
            className="patient-avatar"
          />
          <div className="patient-details">
            <h3>{admission.patient?.first_name} {admission.patient?.last_name}</h3>
            <div className="meta-info">
              <span>ID: {admission.patient?.folder_number}</span>
              <span>DOB: {dayjs(admission.patient?.date_of_birth).format('MMM D, YYYY')}</span>
            </div>
          </div>
        </div>
        
        <div className="admission-info">
          <div className="info-row">
            <span className="label">Department:</span>
            <Tag color="blue">{admission.department?.name || 'N/A'}</Tag>
          </div>
          <div className="info-row">
            <span className="label">Bed:</span>
            <span>{admission.bed_number || 'Not assigned'}</span>
          </div>
          <div className="info-row">
            <span className="label">Admitted:</span>
            <span>{dayjs(admission.admission_date).format('MMM D, YYYY h:mm A')}</span>
          </div>
        </div>
        
        <div className="status-section">
          {getStatusTag(admission.admission_status)}
          {admission.admission_note && (
            <Badge dot status="processing" text="Has Notes" />
          )}
        </div>
      </div>
      
      <Divider className="card-divider" />
      
      <div className="card-actions">
        <Button 
          type="link" 
          icon={<FileTextOutlined />}
          onClick={() => onViewDetails(admission)}
        >
          View Summary
        </Button>
        
        <AdmissionActions admission={admission} user={user} />
      </div>
    </Card>
  );
};

export default AdmissionCard;