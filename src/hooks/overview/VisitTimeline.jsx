import React from 'react';
import { Card, Progress, Descriptions, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const VisitTimeline = ({ statistics }) => {
  const isActive = statistics.visitStatus === 'Active';
  const isAdmitted = statistics.admissionStatus === 'admitted';
  const admissionDate = statistics.admissionDate ? moment(statistics.admissionDate) : null;
  const dischargeDate = statistics.dischargeDate ? moment(statistics.dischargeDate) : null;
  
  const now = moment();
  const totalStay = admissionDate ? now.diff(admissionDate, 'days') : 0;
  const maxExpectedStay = 30; // Assuming max 30 days stay

  const progressPercent = Math.min((totalStay / maxExpectedStay) * 100, 100);

  return (
    <Card title="Visit Timeline" size="small">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Length of Stay</span>
            <span className="text-sm font-medium">{totalStay} days</span>
          </div>
          <Progress 
            percent={progressPercent} 
            showInfo={false}
            strokeColor={isActive ? '#1890ff' : '#52c41a'}
          />
        </div>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Visit Status">
            <Tag color={isActive ? 'green' : 'blue'}>
              {statistics.visitStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Admission Status">
            <Tag color={isAdmitted ? 'green' : 'orange'}>
              {statistics.admissionStatus}
            </Tag>
          </Descriptions.Item>
          {admissionDate && (
            <Descriptions.Item label="Admission Date">
              <CalendarOutlined className="mr-1" />
              {admissionDate.format('LLL')}
            </Descriptions.Item>
          )}
          {dischargeDate && (
            <Descriptions.Item label="Discharge Date">
              <ClockCircleOutlined className="mr-1" />
              {dischargeDate.format('LLL')}
            </Descriptions.Item>
          )}
          {statistics.dischargeType && (
            <Descriptions.Item label="Discharge Type">
              {statistics.dischargeType}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </Card>
  );
};

export default VisitTimeline;