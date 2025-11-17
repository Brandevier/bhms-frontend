import React from 'react';
import { Card, Tag, Space, Typography,Badge } from 'antd';
import { 
  CalendarOutlined,
  IdcardOutlined,
  HeartOutlined,
  HomeOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const BasicInfoTab = ({ patient }) => {
  const { 
    first_name, 
    middle_name, 
    last_name, 
    gender, 
    date_of_birth,
    folder_number,
    status,
    institution,
  } = patient;

  const age = date_of_birth ? 
    new Date().getFullYear() - new Date(date_of_birth).getFullYear() : 'N/A';

  const fullName = `${first_name} ${middle_name || ''} ${last_name}`.trim();

  const InfoItem = ({ icon, label, value, extra }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <Text className="text-gray-500 text-sm font-medium">{label}</Text>
        <div className="mt-1 flex items-center space-x-2">
          {value}
          {extra}
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-4 space-y-4">
      <Card className="border-0 shadow-sm">
        <InfoItem
          icon={<UserOutlined className="text-blue-600" />}
          label="Full Name"
          value={<Text strong className="text-gray-900 text-base">{fullName}</Text>}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <InfoItem
            icon={<CalendarOutlined className="text-green-600" />}
            label="Date of Birth"
            value={
              <Space direction="vertical" size={0}>
                <Text className="text-gray-900">
                  {date_of_birth ? new Date(date_of_birth).toLocaleDateString() : 'N/A'}
                </Text>
                <Text type="secondary" className="text-sm">
                  {age} years old
                </Text>
              </Space>
            }
          />
        </Card>

        <Card className="border-0 shadow-sm">
          <InfoItem
            icon={<UserOutlined className="text-purple-600" />}
            label="Gender"
            value={
              <Tag color={gender === 'M' ? 'blue' : 'pink'} className="capitalize text-sm px-3 py-1">
                {gender === 'M' ? 'Male' : 'Female'}
              </Tag>
            }
          />
        </Card>

        <Card className="border-0 shadow-sm">
          <InfoItem
            icon={<IdcardOutlined className="text-orange-600" />}
            label="Patient ID"
            value={
              <Tag color="blue" className="font-mono text-sm px-3 py-1">
                {folder_number}
              </Tag>
            }
          />
        </Card>

        <Card className="border-0 shadow-sm">
          <InfoItem
            icon={<HeartOutlined className="text-red-600" />}
            label="Status"
            value={
              <Badge 
                status={status === 'active' ? 'success' : 'error'} 
                text={
                  <Text className="capitalize">
                    {status}
                  </Text>
                } 
              />
            }
          />
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <InfoItem
          icon={<HomeOutlined className="text-indigo-600" />}
          label="Institution"
          value={
            <Text className="text-gray-900">
              {institution?.name || 'N/A'}
            </Text>
          }
        />
      </Card>
    </div>
  );
};

export default BasicInfoTab;