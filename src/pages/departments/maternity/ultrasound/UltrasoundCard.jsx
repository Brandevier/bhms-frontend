// components/maternity/UltrasoundCard.js
import React from 'react';
import { Card, Image, Typography, Tag, Space, Button, Divider } from 'antd';
import { EyeOutlined, EditOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { BASE_URL } from '../../../../api/endpoints';


const { Title, Text } = Typography;

const UltrasoundCard = ({ ultrasound, onView, onEdit }) => {
  const getScanTypeColor = (scanType) => {
    const colors = {
      'Obstetric': 'blue',
      'Transvaginal': 'purple',
      'Doppler': 'cyan',
      '3D/4D': 'green',
      'Growth Scan': 'orange',
      'Anomaly Scan': 'red',
      'Other': 'default'
    };
    return colors[scanType] || 'default';
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Images Section */}
        {ultrasound.images && ultrasound.images.length > 0 && (
          <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
            <Image.PreviewGroup>
              <div className="grid grid-cols-2 gap-2">
                {ultrasound.images.slice(0, 4).map((image, index) => (
                  <Image
                    key={index}
                    src={`${BASE_URL}/${image}`}
                    alt={`Ultrasound ${index + 1}`}
                    className="rounded-md object-cover w-full h-20"
                    placeholder={
                      <div className="w-full h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <EyeOutlined />
                      </div>
                    }
                  />
                ))}
              </div>
            </Image.PreviewGroup>
            {ultrasound.images.length > 4 && (
              <Text type="secondary" className="text-xs mt-2 block">
                +{ultrasound.images.length - 4} more images
              </Text>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Tag color={getScanTypeColor(ultrasound.scan_type)} className="text-sm">
              {ultrasound.scan_type}
            </Tag>
            {ultrasound.date && (
              <Text type="secondary" className="text-sm flex items-center">
                <CalendarOutlined className="mr-1" />
                {moment(ultrasound.date).format('MMM D, YYYY')}
              </Text>
            )}
          </div>

          <Title level={5} className="mb-3">
            {ultrasound.scan_type} Ultrasound Scan
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Text strong className="block text-sm text-gray-600">Gestational Age</Text>
              <Text>{ultrasound.gestational_age} weeks</Text>
            </div>
            
            <div>
              <Text strong className="block text-sm text-gray-600">Performed By</Text>
              <Text className="flex items-center">
                <UserOutlined className="mr-1" />
                {ultrasound.staff?.firstName} {ultrasound.staff?.lastName}
              </Text>
            </div>
          </div>

          <div className="mb-3">
            <Text strong className="block text-sm text-gray-600">Indication</Text>
            <Text>{ultrasound.indication || 'Not specified'}</Text>
          </div>

          <div className="mb-3">
            <Text strong className="block text-sm text-gray-600">Findings</Text>
            <Text className="text-gray-800">{ultrasound.findings || 'No findings recorded'}</Text>
          </div>

          <div className="mb-4">
            <Text strong className="block text-sm text-gray-600">Conclusion</Text>
            <Text className="text-gray-800">{ultrasound.conclusion || 'No conclusion recorded'}</Text>
          </div>

          <Divider className="my-3" />

          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => onView(ultrasound)}
              size="small"
            >
              View Details
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(ultrasound)}
              size="small"
            >
              Edit
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default UltrasoundCard;