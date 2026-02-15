import React from 'react';
import { Modal, Tag, Space, Typography, Button, Divider } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  EditOutlined,
  UserOutlined,
  CalendarOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { getStatusColor, getDiagnosisTypeInfo } from './utils';

const { Title, Text } = Typography;

const InfoRow = ({ icon, label, value, col = false }) => (
  <div className={`flex ${col ? 'flex-col items-start' : 'items-center justify-between'} p-3 bg-gray-50 rounded-lg`}>
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <Text type="secondary">{label}</Text>
    </div>
    <div className={`${col ? 'mt-1 w-full' : ''}`}>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text strong className="text-gray-800">{value || 'N/A'}</Text>
      ) : (
        value
      )}
    </div>
  </div>
);

const DiagnosisDetailModal = ({ visible, diagnosis, onClose, onEdit }) => {
  if (!diagnosis) return null;

  const diagnosisType = getDiagnosisTypeInfo(diagnosis.diagnosis_type);

  // Format date/time
  const diagnosisDate = diagnosis.diagnosis_date ? moment(diagnosis.diagnosis_date) : null;
  const formattedDate = diagnosisDate ? diagnosisDate.format('MMMM DD, YYYY') : 'N/A';
  const formattedTime = diagnosisDate ? diagnosisDate.format('hh:mm A') : 'N/A';

  // Doctor name
  const doctorName = diagnosis.staff
    ? `${diagnosis.staff.firstName || ''} ${diagnosis.staff.lastName || ''}`.trim() || 'N/A'
    : 'N/A';

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="diagnosis-detail-modal"
      closeIcon={<Button type="text" shape="circle" icon={<FileTextOutlined />} />}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {diagnosis.diagnosis_type === 'confirmed_diagnosis' ? (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleOutlined className="text-green-600 text-xl" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <ClockCircleOutlined className="text-orange-600 text-xl" />
            </div>
          )}
          <div>
            <Title level={4} className="!mb-1">Diagnosis Details</Title>
            <div className="flex items-center gap-2">
              <Tag color={diagnosisType.badgeColor} className="!rounded-full px-3">
                {diagnosisType.label}
              </Tag>
              <Tag color={getStatusColor(diagnosis.status)} className="!rounded-full px-3">
                {diagnosis.status}
              </Tag>
            </div>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(diagnosis)}
          className="shadow-sm"
        >
          Edit Diagnosis
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileTextOutlined className="text-blue-500" />
            <Text strong className="text-gray-700">Basic Information</Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow
              icon={<MedicineBoxOutlined />}
              label="Diagnosis Name"
              value={diagnosis?.systemDiagnosis?.diagnosis_name || 'Unspecified'}
            />
            <InfoRow
              icon={<IdcardOutlined />}
              label="ICD-10 Code"
              value={diagnosis?.systemDiagnosis?.icd_10_code || 'N/A'}
            />
            <InfoRow
              icon={<CalendarOutlined />}
              label="Diagnosis Date"
              value={formattedDate}
            />
            <InfoRow
              icon={<ClockCircleOutlined />}
              label="Time"
              value={formattedTime}
            />
          </div>
        </div>

        <Divider className="my-2" />

        {/* Clinical Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileDoneOutlined className="text-purple-500" />
            <Text strong className="text-gray-700">Clinical Details</Text>
          </div>
          <div className="space-y-3">
            <InfoRow
              icon={<FileTextOutlined />}
              label="Chief Complaint"
              value={diagnosis.chief_complain || 'Not specified'}
              col
            />
            <InfoRow
              icon={<FileTextOutlined />}
              label="Doctor Evaluation"
              value={diagnosis.doctor_evaluation || 'Not provided'}
              col
            />
          </div>
        </div>

        <Divider className="my-2" />

        {/* Additional Information */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserOutlined className="text-indigo-500" />
            <Text strong className="text-gray-700">Additional Information</Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow
              icon={<UserOutlined />}
              label="Doctor"
              value={doctorName}
            />
            <InfoRow
              icon={<CalendarOutlined />}
              label="Last Updated"
              value={diagnosis.updatedAt ? moment(diagnosis.updatedAt).format('MMM DD, YYYY') : 'N/A'}
            />
            <div className="md:col-span-2">
              <InfoRow
                icon={<IdcardOutlined />}
                label="Record ID"
                value={<Text code className="text-xs">{diagnosis.id}</Text>}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
        <Button onClick={onClose} size="large">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default DiagnosisDetailModal;