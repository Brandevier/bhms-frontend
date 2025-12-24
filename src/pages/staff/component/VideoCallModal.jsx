// src/components/staff/video/VideoCallModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  message,
  Spin,
  Switch,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  ScheduleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { createMeeting } from '../../../redux/slice/meetingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStaff } from '../../../redux/slice/staff_admin_managment_slice';

const { Option } = Select;
const { TextArea } = Input;

const VideoCallModal = ({
  visible,
  onCancel,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [duration, setDuration] = useState(30); // minutes
  const [searchTerm, setSearchTerm] = useState('');
  
  const dispatch = useDispatch();
  const { loading: meetingLoading, error } = useSelector((state) => state.meeting);
  const { loading: staffLoading, allStaffs } = useSelector((state) => state.adminStaffManagement);

useEffect(() => {
  if (visible) {
    form.resetFields();
    setIsScheduled(false);
    setScheduleDate(null);
    setScheduleTime(null);
    setDuration(30);
    setSearchTerm('');
    
    // Clear any form errors
    form.setFields([
      { name: 'title', errors: [] },
      { name: 'participants', errors: [] },
      { name: 'scheduleDate', errors: [] },
      { name: 'scheduleTime', errors: [] },
    ]);
    
    dispatch(getAllStaff());
  }
}, [visible, form, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
  return () => {
    // Cleanup when component unmounts
    form.resetFields();
  };
}, [form]);

  // Transform staff data to match component expectations
  const transformStaffData = (staff) => {
    return {
      id: staff.id,
      name: `${staff.firstName} ${staff.lastName}`,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: staff.role?.name || 'Staff',
      department: staff.staff_departments?.[0]?.department?.name || 'No Department',
      avatar: staff.profile_pic,
      isOnline: true, // You can implement actual online status logic
      isInCall: false, // You can implement actual call status logic
      phone_number: staff.phone_number,
      staffID: staff.staffID
    };
  };

  const availableStaff = allStaffs?.map(transformStaffData) || [];

  const filteredStaff = availableStaff.filter(staff =>
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.staffID?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateMeeting = async () => {
      const values = await form.validateFields();
      
      const meetingData = {
        title: values.title,
        participants: values.participants || [],
        institution_id:currentUser.institution.id,
        department_id: currentUser.staff_departments?.[0]?.department?.id || null,
        notes: values.note,
        duration_minutes: duration,
        isScheduled: isScheduled,
        scheduled_time: isScheduled && scheduleDate && scheduleTime 
          ? moment(scheduleDate).set({
              hour: moment(scheduleTime).hour(),
              minute: moment(scheduleTime).minute()
            }).toISOString()
          : null,
        host_id: currentUser.id,
        status: isScheduled ? 'scheduled' : 'active',
      };

      const result = await dispatch(createMeeting(meetingData)).unwrap().then((res)=>{
        message.success('Meeting created successfully');
        onCancel();
      });
  };

  const getallStaffstatus = (staff) => {
    if (staff.isOnline) {
      return staff.isInCall ? 'In Call' : 'Available';
    }
    return 'Offline';
  };

  const getStatusColor = (staff) => {
    if (!staff.isOnline) return 'red';
    return staff.isInCall ? 'orange' : 'green';
  };

  const durationOptions = [15, 30, 45, 60, 90, 120];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <VideoCameraOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {isScheduled ? 'Schedule Video Conference' : 'Start Video Conference'}
            </div>
            <div className="text-sm text-gray-500">
              {isScheduled ? 'Plan your meeting in advance' : 'Start an immediate video call'}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
      className="video-call-modal"
      style={{ top: 20 }}
    >
      <Spin spinning={staffLoading || meetingLoading}>
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Row gutter={[16, 16]}>
            {/* Left Column - Basic Information */}
            <Col span={12}>
              <Card size="small" className="h-full">
                <div className="space-y-4">
                  {/* Call Title */}
                  <Form.Item
                    name="title"
                    label="Meeting Title"
                    rules={[{ required: true, message: 'Please enter meeting title' }]}
                  >
                    <Input
                      placeholder="e.g., Emergency Consultation, Team Meeting"
                      prefix={<EditOutlined className="text-gray-400" />}
                      size="large"
                    />
                  </Form.Item>

                  {/* Host Information (Current User) */}
                  <Form.Item label="Host">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Avatar 
                        size={32} 
                        src={currentUser.profile_pic} 
                        icon={<UserOutlined />}
                      />
                      <div>
                        <div className="font-medium text-gray-800">
                          {currentUser.firstName} {currentUser.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {currentUser.role?.name} • {currentUser.staff_departments?.[0]?.department?.name || 'No Department'}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {currentUser.staffID}
                        </div>
                      </div>
                      <Tag color="blue" className="ml-auto">
                        Host
                      </Tag>
                    </div>
                  </Form.Item>

                  {/* Schedule Toggle */}
                  <Form.Item label="Schedule Meeting">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {isScheduled ? 'Scheduled Meeting' : 'Immediate Start'}
                      </span>
                      <Switch
                        checked={isScheduled}
                        onChange={setIsScheduled}
                        checkedChildren={<ScheduleOutlined />}
                        unCheckedChildren={<PlayCircleOutlined />}
                      />
                    </div>
                  </Form.Item>

                  {/* Schedule Fields */}
                  {isScheduled && (
                    <div className="space-y-3">
                      <Form.Item
                        label="Date"
                        name="scheduleDate"
                        rules={[{ required: isScheduled, message: 'Please select date' }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          size="large"
                          value={scheduleDate}
                          onChange={setScheduleDate}
                          disabledDate={(current) => current && current < moment().startOf('day')}
                          suffixIcon={<CalendarOutlined />}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Time"
                        name="scheduleTime"
                        rules={[{ required: isScheduled, message: 'Please select time' }]}
                      >
                        <TimePicker
                          style={{ width: '100%' }}
                          // size="large}
                          size='large'
                          value={scheduleTime}
                          onChange={setScheduleTime}
                          format="HH:mm"
                          minuteStep={15}
                          suffixIcon={<ClockCircleOutlined />}
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            {/* Right Column - Additional Settings */}
            <Col span={12}>
              <Card size="small" className="h-full">
                <div className="space-y-4">
                  {/* Duration */}
                  <Form.Item 
                    label="Duration"
                    name="duration"
                  >
                    <Select
                      value={duration}
                      onChange={setDuration}
                      size="large"
                    >
                      {durationOptions.map(mins => (
                        <Option key={mins} value={mins}>
                          {mins} minutes
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Additional Participants */}
                  <Form.Item 
                    name="participants" 
                    label="Additional Participants"
                    rules={[{ required: true, message: 'Please select at least one participant' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Search and select participants..."
                      size="large"
                      showSearch
                      filterOption={false}
                      onSearch={setSearchTerm}
                      loading={staffLoading}
                    >
                      {filteredStaff
                        .filter(staff => staff.id !== currentUser.id)
                        .map(staff => (
                          <Option key={staff.id} value={staff.id}>
                            <div className="flex items-center gap-2">
                              <Avatar 
                                size="small" 
                                src={staff.avatar} 
                                icon={<UserOutlined />}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{staff.name}</span>
                                <span className="text-xs text-gray-500">
                                  {staff.role} • {staff.staffID}
                                </span>
                              </div>
                              <Tag 
                                color={getStatusColor(staff)} 
                                size="small"
                                className="ml-auto"
                              >
                                {getallStaffstatus(staff)}
                              </Tag>
                            </div>
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>

                  {/* Meeting Note */}
                  <Form.Item name="note" label="Meeting Note">
                    <TextArea
                      rows={3}
                      placeholder="Add meeting agenda, special instructions, or notes..."
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
            <Button 
              onClick={onCancel} 
              size="large" 
              style={{ width: 120 }}
              disabled={meetingLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={isScheduled ? <ScheduleOutlined /> : <PlayCircleOutlined />}
              onClick={handleCreateMeeting}
              size="large"
              loading={meetingLoading}
              disabled={meetingLoading}
              style={{ 
                width: 200,
                background: isScheduled 
                  ? 'linear-gradient(135deg, #fa8c16 0%, #faad14 100%)' 
                  : 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}
            >
              {meetingLoading 
                ? 'Creating...' 
                : isScheduled 
                  ? 'Schedule Meeting' 
                  : 'Start Video Call'
              }
            </Button>
          </div>

          {/* Quick Info */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-semibold text-gray-600">Host</div>
                <div className="text-lg font-bold text-gray-800">
                  You
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">Duration</div>
                <div className="text-lg font-bold text-gray-800">{duration}m</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600">Type</div>
                <div className="text-lg font-bold text-gray-800">
                  {isScheduled ? 'Scheduled' : 'Immediate'}
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default VideoCallModal;