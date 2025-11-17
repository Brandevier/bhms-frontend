import React from 'react';
import { Card, Tag, Space, Typography, Empty } from 'antd';
import { 
  PhoneOutlined,
  UserOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const ContactInfoTab = ({ patient }) => {
  const { metadata } = patient;

  const ContactCard = ({ 
    title, 
    name, 
    relationship, 
    phone, 
    icon, 
    color = 'blue' 
  }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <Title level={5} className={`text-${color}-600 mb-2`}>
            {title}
          </Title>
          <div className="space-y-2">
            <div>
              <Text strong className="text-gray-900">{name}</Text>
            </div>
            <div>
              <Tag color={color} className="capitalize">
                {relationship}
              </Tag>
            </div>
            <div className="flex items-center text-gray-600">
              <PhoneOutlined className="mr-2" />
              <Text className="text-gray-700">{phone}</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (!metadata?.relatives?.next_of_kin && !metadata?.relatives?.emergency_contact) {
    return (
      <div className="py-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-gray-500">No contact information available</span>
          }
        >
          <Text type="secondary">
            Add emergency contacts in the edit form
          </Text>
        </Empty>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {metadata?.relatives?.next_of_kin && (
          <ContactCard
            title="Next of Kin"
            name={metadata.relatives.next_of_kin.name}
            relationship={metadata.relatives.next_of_kin.relationship}
            phone={metadata.relatives.next_of_kin.phone}
            icon={<UserOutlined className="text-green-600" />}
            color="green"
          />
        )}

        {metadata?.relatives?.emergency_contact && (
          <ContactCard
            title="Emergency Contact"
            name={metadata.relatives.emergency_contact.name}
            relationship={metadata.relatives.emergency_contact.relationship}
            phone={metadata.relatives.emergency_contact.phone}
            icon={<SafetyOutlined className="text-red-600" />}
            color="red"
          />
        )}
      </div>
    </div>
  );
};

export default ContactInfoTab;