// components/staff/AttendanceList.js
import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const AttendanceList = ({ attendance = [] }) => {
  const getTimeOfDay = (timeString) => {
    const hour = moment(timeString).hour();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    return 'Night';
  };

  const getPeriodColor = (period) => {
    switch (period) {
      case 'Morning': return 'gold';
      case 'Afternoon': return 'orange';
      case 'Night': return 'purple';
      default: return 'default';
    }
  };

  const formattedAttendance = attendance.map(entry => ({
    id: entry.id,
    date: moment(entry.scannedAt).format('YYYY-MM-DD'),
    day: moment(entry.scannedAt).format('dddd'),
    time: moment(entry.scannedAt).format('h:mm A'),
    period: getTimeOfDay(entry.scannedAt)
  }));

  return (
    <Card title="Attendance Records" className="mt-6">
      <List
        dataSource={formattedAttendance}
        renderItem={(item) => (
          <List.Item>
            <div className="flex justify-between items-center w-full">
              <div>
                <Text strong className="block">{item.date}</Text>
                <Text type="secondary" className="text-sm">{item.day}</Text>
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2 text-gray-400" />
                <Text className="mr-3">{item.time}</Text>
                <Tag color={getPeriodColor(item.period)}>
                  {item.period}
                </Tag>
              </div>
            </div>
          </List.Item>
        )}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`
        }}
      />
    </Card>
  );
};

export default AttendanceList;