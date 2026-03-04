// components/staff/StaffLeaves.js
import React, { useEffect } from 'react';
import { Card, List, Tag, Button, Modal, Progress, Typography, Form, Input, DatePicker, Select, message, Spin, Empty } from 'antd';
import { CalendarOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLeave } from '../../../redux/hooks/useLeave';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StaffLeaves = ({ staffId, staffName }) => {
  const {
    leaves,
    leaveBalance,
    loading,
    error,
    success,
    requestNewLeave,
    getMyLeaves,
    getLeaveBalance,
    clearLeaveError,
    clearLeaveSuccess
  } = useLeave();

  const [selectedLeave, setSelectedLeave] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [requestModalVisible, setRequestModalVisible] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  // Default leave balances in case API returns empty
  const defaultLeaveBalances = {
    annual: { total: 21, used: 0, remaining: 21 },
    sick: { total: 15, used: 0, remaining: 15 },
    emergency: { total: 5, used: 0, remaining: 5 }
  };

  // Process leave balance data from API
  const processedLeaveBalances = React.useMemo(() => {
    if (!leaveBalance || !Array.isArray(leaveBalance) || leaveBalance.length === 0) {
      return defaultLeaveBalances;
    }

    const balances = {};
    leaveBalance.forEach(balance => {
      const type = balance.leaveType?.toLowerCase() || 'annual';
      balances[type] = {
        total: balance.total || 0,
        used: balance.taken || 0,
        remaining: balance.remaining || 0
      };
    });
    return Object.keys(balances).length > 0 ? balances : defaultLeaveBalances;
  }, [leaveBalance]);

  useEffect(() => {
    getMyLeaves();
    getLeaveBalance();
  }, []);

  // Handle error/success messages
  React.useEffect(() => {
    if (error) {
      message.error(error.message || 'An error occurred');
      clearLeaveError();
    }
  }, [error]);

  React.useEffect(() => {
    if (success) {
      message.success('Operation completed successfully!');
      clearLeaveSuccess();
    }
  }, [success]);

  const handleSubmitLeaveRequest = async (values) => {
    try {
      setSubmitting(true);
      const requestData = {
        leaveType: values.leaveType,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        reason: values.reason,
        emergencyContact: values.emergencyContact
      };

      await requestNewLeave(requestData);
      
      message.success('Leave request submitted successfully! Admin has been notified.');
      form.resetFields();
      setRequestModalVisible(false);
      getMyLeaves(); // Refresh data
      getLeaveBalance();
    } catch (err) {
      console.error('Error submitting leave request:', err);
      message.error(err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'annual leave': return 'blue';
      case 'sick leave': return 'volcano';
      case 'emergency leave': return 'red';
      default: return 'default';
    }
  };

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setModalVisible(true);
  };

  const openRequestModal = () => {
    setRequestModalVisible(true);
  };

  // Use loading from Redux - show spinner during initial load
  const displayLoading = loading && (!leaves || leaves.length === 0);

  if (displayLoading) {
    return (
      <Card 
        title={
          <span className="flex items-center">
            <CalendarOutlined className="mr-2 text-green-500" />
            Leave Management
          </span>
        }
        className="mt-6"
      >
        <div className="flex justify-center items-center p-10">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

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
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="small"
          onClick={openRequestModal}
        >
          Request Leave
        </Button>
      }
    >
      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(processedLeaveBalances).map(([type, balance]) => (
          <Card key={type} size="small">
            <Text strong className="capitalize">{type} Leave</Text>
            <Progress
              percent={balance.total > 0 ? Math.round((balance.used / balance.total) * 100) : 0}
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
      {!leaves || leaves.length === 0 ? (
        <Empty description="No leave requests yet" />
      ) : (
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
                    <Text strong>{leave.leaveType}</Text>
                    <Tag color={getStatusColor(leave.status)} className="ml-2">
                      {leave.status?.toUpperCase()}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <div>
                      <Text type="secondary">
                        {moment(leave.startDate).format('MMM D')} - {moment(leave.endDate).format('MMM D, YYYY')}
                      </Text>
                      <Tag color={getTypeColor(leave.leaveType)} className="ml-2">
                        {leave.durationDays} day(s)
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
      )}

      {/* Leave Details Modal */}
      <Modal
        title="Leave Details"
        open={modalVisible}
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
                <Title level={5}>{selectedLeave.leaveType}</Title>
                <Text type="secondary">
                  {moment(selectedLeave.startDate).format('MMM D, YYYY')} - {moment(selectedLeave.endDate).format('MMM D, YYYY')}
                </Text>
              </div>
              <Tag color={getStatusColor(selectedLeave.status)}>
                {selectedLeave.status?.toUpperCase()}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Duration</Text>
                <p>{selectedLeave.durationDays} day(s)</p>
              </div>
              <div>
                <Text strong>Type</Text>
                <p>
                  <Tag color={getTypeColor(selectedLeave.leaveType)}>
                    {selectedLeave.leaveType}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <Text strong>Reason</Text>
              <p className="bg-gray-50 p-3 rounded">{selectedLeave.reason}</p>
            </div>

            {selectedLeave.emergencyContact && (
              <div>
                <Text strong>Emergency Contact</Text>
                <p>{selectedLeave.emergencyContact}</p>
              </div>
            )}

            {selectedLeave.approvedById && (
              <div>
                <Text strong>Approved By</Text>
                <p>Admin</p>
              </div>
            )}

            {selectedLeave.approvedAt && (
              <div>
                <Text strong>Approved Date</Text>
                <p>{moment(selectedLeave.approvedAt).format('MMM D, YYYY')}</p>
              </div>
            )}

            {selectedLeave.rejectionReason && (
              <div>
                <Text strong>Rejection Reason</Text>
                <p className="text-red-500 bg-red-50 p-3 rounded">{selectedLeave.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Request Leave Modal */}
      <Modal
        title="Request Leave"
        open={requestModalVisible}
        onCancel={() => setRequestModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitLeaveRequest}
        >
          <Form.Item
            name="leaveType"
            label="Leave Type"
            rules={[{ required: true, message: 'Please select leave type' }]}
          >
            <Select placeholder="Select leave type">
              <Option value="Annual Leave">Annual Leave</Option>
              <Option value="Sick Leave">Sick Leave</Option>
              <Option value="Emergency Leave">Emergency Leave</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <DatePicker.RangePicker 
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <TextArea rows={3} placeholder="Enter reason for leave" />
          </Form.Item>

          <Form.Item
            name="emergencyContact"
            label="Emergency Contact (Optional)"
          >
            <Input placeholder="Phone number for emergency contact" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setRequestModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Submit Request
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default StaffLeaves;
