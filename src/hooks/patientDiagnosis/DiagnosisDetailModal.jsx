import React from 'react';
import { Modal, Descriptions, Tag, Space, Typography,Button } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined ,
  EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { getStatusColor, getDiagnosisTypeInfo } from './utils';

const { Text } = Typography;

const DiagnosisDetailModal = ({ 
  visible, 
  diagnosis, 
  onClose, 
  onEdit 
}) => {
  if (!diagnosis) return null;
  
  const diagnosisType = getDiagnosisTypeInfo(diagnosis.diagnosis_type);

  return (
    <Modal
      title={
        <Space>
          {diagnosis.diagnosis_type === 'confirmed_diagnosis' 
            ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
            : <ClockCircleOutlined style={{ color: '#fa8c16' }} />
          }
          <span>Diagnosis Details</span>
          <Tag color={diagnosisType.badgeColor}>
            {diagnosisType.label}
          </Tag>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="edit" icon={<EditOutlined />} onClick={() => onEdit(diagnosis)}>
          Edit Diagnosis
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={700}
      centered
    >
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Diagnosis Name" span={2}>
          <Text strong>{diagnosis?.systemDiagnosis?.diagnosis_name || 'Unspecified'}</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Type">
          <Tag color={diagnosisType.badgeColor}>
            {diagnosisType.label}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(diagnosis.status)}>
            {diagnosis.status}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="ICD-10 Code">
          {diagnosis?.systemDiagnosis?.icd_10_code || 'N/A'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Diagnosis Date">
          {moment(diagnosis.diagnosis_date).format("MMMM DD, YYYY")}
        </Descriptions.Item>
        
        <Descriptions.Item label="Time">
          {moment(diagnosis.diagnosis_date).format("hh:mm A")}
        </Descriptions.Item>
        
        <Descriptions.Item label="Chief Complaint" span={2}>
          {diagnosis.chief_complain || 'Not specified'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Doctor Evaluation" span={2}>
          {diagnosis.doctor_evaluation || 'Not provided'}
        </Descriptions.Item>
        
        <Descriptions.Item label="Doctor">
          {diagnosis.staff 
            ? `${diagnosis.staff.firstName || ''} ${diagnosis.staff.lastName || ''}`
            : 'N/A'
          }
        </Descriptions.Item>
        
        <Descriptions.Item label="Last Updated">
          {moment(diagnosis.updatedAt).format("MMM DD, YYYY")}
        </Descriptions.Item>
        
        <Descriptions.Item label="Record ID">
          <Text code style={{ fontSize: '12px' }}>
            {diagnosis.id}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DiagnosisDetailModal;