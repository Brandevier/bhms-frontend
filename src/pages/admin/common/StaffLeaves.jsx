// components/staff/StaffLeaves.js
import React, { useState } from 'react';
import { Card, List, Tag, Button, Modal, Progress, Typography, Timeline } from 'antd';
import { CalendarOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const StaffLeaves = ({ staffId, staffName }) => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dummy data - replace with actual API data
  const leaves = [
    {
      id: 1,
      type: 'Annual Leave',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
      duration: 5,
      status: 'approved',
      reason: 'Family vacation',
      approvedBy: 'Dr. Sarah Johnson',
      approvedDate: '2024-01-05'
    },
    {
      id: 2,
      type: 'Sick Leave',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      duration: 2,
      status: 'pending',
      reason: 'Medical appointment',
      requestedDate: '2024-01-20'
    },
    {
      id: 3,
      type: 'Emergency Leave',
      startDate: '2023-12-15',
      endDate: '2023-12-16',
      duration: 1,
      status: 'approved',
      reason: 'Family emergency',
      approvedBy: 'Dr. Mike Chen',
      approvedDate: '2023-12-14'
    }
  ];

  const leaveBalances = {
    annual: { total: 21, used: 7, remaining: 14 },
    sick: { total: 15, used: 3, remaining: 12 },
    emergency: { total: 5, used: 1, remaining: 4 }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Annual Leave': return 'blue';
      case 'Sick Leave': return 'volcano';
      case 'Emergency Leave': return 'red';
      default: return 'default';
    }
  };

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setModalVisible(true);
  };

  return (
    <Card 
      title={
        <span className="flex items-center">
          <CalendarOutlined className="mr-2 text-green-500" />
          Leave Management
        </span>
      }
      className="mt-6"
      extra={
        <Button type="primary" icon={<PlusOutlined />} size="small">
          Request Leave
        </Button>
      }
    >
      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(leaveBalances).map(([type, balance]) => (
          <Card key={type} size="small">
            <Text strong className="capitalize">{type} Leave</Text>
            <Progress
              percent={Math.round((balance.used / balance.total) * 100)}
              status="active"
              className="my-2"
            />
            <div className="flex justify-between text-sm">
              <span>Used: {balance.used}</span>
              <span>Remaining: {balance.remaining}</span>
              <span>Total: {balance.total}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave History */}
      <List
        dataSource={leaves}
        renderItem={(leave) => (
          <List.Item
            actions={[
              <Button 
                type="link" 
                icon={<EyeOutlined />} 
                onClick={() => handleViewLeave(leave)}
                size="small"
              >
                View
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <div className="flex items-center">
                  <Text strong>{leave.type}</Text>
                  <Tag color={getStatusColor(leave.status)} className="ml-2">
                    {leave.status.toUpperCase()}
                  </Tag>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div>
                    <Text type="secondary">
                      {moment(leave.startDate).format('MMM D')} - {moment(leave.endDate).format('MMM D, YYYY')}
                    </Text>
                    <Tag color={getTypeColor(leave.type)} className="ml-2">
                      {leave.duration} day(s)
                    </Tag>
                  </div>
                  <Text type="secondary" className="text-sm">
                    {leave.reason}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Leave Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={500}
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Title level={5}>{selectedLeave.type}</Title>
                <Text type="secondary">
                  {moment(selectedLeave.startDate).format('MMM D, YYYY')} - {moment(selectedLeave.endDate).format('MMM D, YYYY')}
                </Text>
              </div>
              <Tag color={getStatusColor(selectedLeave.status)}>
                {selectedLeave.status.toUpperCase()}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Duration</Text>
                <p>{selectedLeave.duration} day(s)</p>
              </div>
              <div>
                <Text strong>Type</Text>
                <p>
                  <Tag color={getTypeColor(selectedLeave.type)}>
                    {selectedLeave.type}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <Text strong>Reason</Text>
              <p className="bg-gray-50 p-3 rounded">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.approvedBy && (
              <div>
                <Text strong>Approved By</Text>
                <p>{selectedLeave.approvedBy}</p>
              </div>
            )}

            {selectedLeave.approvedDate && (
              <div>
                <Text strong>Approved Date</Text>
                <p>{moment(selectedLeave.approvedDate).format('MMM D, YYYY')}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default StaffLeaves;