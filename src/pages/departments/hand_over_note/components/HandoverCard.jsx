import React from 'react';
import { Card, Tag, Avatar, Button, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

const HandoverCard = ({ handover, onEdit, onDelete, onAcknowledge }) => {
  const getShiftColor = (shift) => {
    const colors = {
      morning: 'blue',
      afternoon: 'orange',
      night: 'purple'
    };
    return colors[shift] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      submitted: 'processing',
      acknowledged: 'success'
    };
    return colors[status] || 'default';
  };

  return (
    <Card
      className="handover-card hover:shadow-lg transition-all duration-300 border-0 rounded-xl"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderLeft: `4px solid ${
          handover.status === 'acknowledged' ? '#10b981' : 
          handover.status === 'submitted' ? '#3b82f6' : '#6b7280'
        }`
      }}
      onClick={()=>console.log(handover)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={handover.from_nurse?.photo} 
            icon={<UserOutlined />}
            size="large"
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div>
            <Text strong className="text-gray-800 text-base">
              {handover.from_nurse?.firstName} {handover.from_nurse?.lastName}
            </Text>
            <div className="flex items-center space-x-2 mt-1">
              <Tag color={getShiftColor(handover.shift)} className="capitalize font-medium">
                {handover.shift} Shift
              </Tag>
              <Tag color={getStatusColor(handover.status)} className="capitalize font-medium">
                {handover.status}
              </Tag>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <Text type="secondary" className="text-sm">
            <ClockCircleOutlined className="mr-1" />
            {dayjs(handover.created_at).format('MMM D, YYYY')}
          </Text>
          <div className="text-xs text-gray-400 mt-1">
            {dayjs(handover.created_at).format('h:mm A')}
          </div>
        </div>
      </div>

      {/* Patient Info */}
      {handover.visit?.patient && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-100">
          <Text strong className="text-gray-700 flex items-center">
            <UserOutlined className="mr-2 text-blue-500" />
            Patient: {handover.visit.patient.first_name} {handover.visit.patient.last_name}
          </Text>
          <Text type="secondary" className="block text-sm mt-1">
            MR#: {handover.visit.patient.medicalRecordNumber}
          </Text>
        </div>
      )}

      {/* Ongoing Treatments */}
      {handover.ongoing_treatments && (
        <div className="mb-3">
          <Text strong className="text-gray-700 mb-2 block">Ongoing Treatments</Text>
          <Paragraph 
            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            className="text-gray-600 bg-blue-50 p-3 rounded-lg text-sm"
          >
            {handover.ongoing_treatments}
          </Paragraph>
        </div>
      )}

      {/* Notes */}
      {handover.notes && (
        <div className="mb-4">
          <Text strong className="text-gray-700 mb-2 block flex items-center">
            <FileTextOutlined className="mr-2 text-green-500" />
            Additional Notes
          </Text>
          <Paragraph 
            ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
            className="text-gray-600 bg-green-50 p-3 rounded-lg text-sm"
          >
            {handover.notes}
          </Paragraph>
        </div>
      )}

      {/* To Nurse (if assigned) */}
      {handover.to_nurse && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <Text strong className="text-purple-700">
            Handed over to: {handover.to_nurse.firstName} {handover.to_nurse.lastName}
          </Text>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(handover)}
            className="text-blue-500 hover:text-blue-700"
            size="small"
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(handover)}
            className="text-red-500 hover:text-red-700"
            size="small"
          >
            Delete
          </Button>
        </Space>

        {handover.status !== 'acknowledged' && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => onAcknowledge(handover)}
            size="small"
            className="bg-green-500 border-green-500 hover:bg-green-600"
          >
            Acknowledge
          </Button>
        )}
      </div>
    </Card>
  );
};

export default HandoverCard;