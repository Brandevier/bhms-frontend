import React from 'react';
import { Descriptions, Tag, Badge } from 'antd';
import { PhoneOutlined, HomeOutlined } from '@ant-design/icons';

const PatientInfoTabs = ({ patient }) => {
  const { 
    first_name, 
    middle_name, 
    last_name, 
    gender, 
    date_of_birth,
    folder_number,
    status,
    institution,
    metadata
  } = patient;

  const age = date_of_birth ? 
    new Date().getFullYear() - new Date(date_of_birth).getFullYear() : 'N/A';

  const items = [
    {
      key: '1',
      label: 'Basic Info',
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Full Name">
            {`${first_name} ${middle_name || ''} ${last_name}`}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            <Tag color={gender === 'M' ? 'blue' : 'pink'}>
              {gender === 'M' ? 'Male' : 'Female'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Age">{age}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {date_of_birth ? new Date(date_of_birth).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Folder Number">
            <Tag color="geekblue">{folder_number}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge 
              status={status === 'active' ? 'success' : 'error'} 
              text={status} 
            />
          </Descriptions.Item>
          <Descriptions.Item label="Institution" span={2}>
            <div className="flex items-center">
              <HomeOutlined className="mr-2" />
              {institution?.name || 'N/A'}
            </div>
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: 'Contact Info',
      children: (
        <Descriptions bordered column={2}>
          {metadata?.relatives?.next_of_kin && (
            <>
              <Descriptions.Item label="Next of Kin">
                {metadata.relatives.next_of_kin.name}
              </Descriptions.Item>
              <Descriptions.Item label="Relationship">
                {metadata.relatives.next_of_kin.relationship}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  {metadata.relatives.next_of_kin.phone}
                </div>
              </Descriptions.Item>
            </>
          )}
          {metadata?.relatives?.emergency_contact && (
            <>
              <Descriptions.Item label="Emergency Contact">
                {metadata.relatives.emergency_contact.name}
              </Descriptions.Item>
              <Descriptions.Item label="Relationship">
                {metadata.relatives.emergency_contact.relationship}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  {metadata.relatives.emergency_contact.phone}
                </div>
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      ),
    },
  ];

  return <Descriptions items={items} />;
};

export default PatientInfoTabs;