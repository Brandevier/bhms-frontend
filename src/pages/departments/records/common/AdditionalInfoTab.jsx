import React from 'react';
import { Card, Tag, Space, Typography, Empty } from 'antd';
import { 
  EnvironmentOutlined,
  IdcardOutlined,
  SafetyOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const AdditionalInfoTab = ({ patient }) => {
  const { metadata } = patient;

  const InfoCard = ({ icon, title, children, className = '' }) => (
    <Card className={`border-0 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <Title level={5} className="text-gray-700 mb-3">{title}</Title>
          {children}
        </div>
      </div>
    </Card>
  );

  const hasAdditionalInfo = metadata?.address || metadata?.insurance || 
    (metadata?.allergies && metadata.allergies.length > 0) || metadata?.notes;

  if (!hasAdditionalInfo) {
    return (
      <div className="py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-gray-500">No additional information available</span>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      {metadata?.address && (
        <InfoCard
          icon={<EnvironmentOutlined className="text-blue-600" />}
          title="Address"
        >
          <Text className="text-gray-900">{metadata.address}</Text>
        </InfoCard>
      )}

      {metadata?.insurance && (
        <InfoCard
          icon={<IdcardOutlined className="text-green-600" />}
          title="Insurance Information"
        >
          <div className="space-y-2">
            <div>
              <Text strong className="text-gray-900">{metadata.insurance.provider}</Text>
            </div>
            <div>
              <Tag color="orange" className="font-mono">
                {metadata.insurance.policy_number}
              </Tag>
            </div>
            {metadata.insurance.group_number && (
              <div>
                <Text type="secondary">Group: {metadata.insurance.group_number}</Text>
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {metadata?.allergies && metadata.allergies.length > 0 && (
        <InfoCard
          icon={<SafetyOutlined className="text-red-600" />}
          title="Allergies"
        >
          <Space wrap>
            {metadata.allergies.map((allergy, index) => (
              <Tag key={index} color="red" className="capitalize px-3 py-1">
                {allergy}
              </Tag>
            ))}
          </Space>
        </InfoCard>
      )}

      {metadata?.notes && (
        <InfoCard
          icon={<FileTextOutlined className="text-purple-600" />}
          title="Additional Notes"
        >
          <div className="bg-gray-50 rounded-lg p-3">
            <Text className="text-gray-700">{metadata.notes}</Text>
          </div>
        </InfoCard>
      )}
    </div>
  );
};

export default AdditionalInfoTab;