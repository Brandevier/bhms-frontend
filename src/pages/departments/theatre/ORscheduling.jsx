import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  TimePicker, 
  Select, 
  Tag, 
  Space, 
  Divider, 
  Row, 
  Col,
  Statistic,
  Tabs,
  Popconfirm,
  message,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createOrSchedule,
  fetchAvailableTimeSlots,
  fetchOrScheduleById,
  fetchOrSchedules,
  fetchSurgeonSchedules,
  cancelOrSchedule,
  updateOrSchedule,
  completeSurgery,
  setStatusFilter,
  setDateFilter,
  clearCurrentSchedule,
  clearAvailableSlots
} from '../../../redux/slice/ORSlice';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ORscheduling = () => {
  const dispatch = useDispatch();
  const { 
    loading, 
    schedules, 
    currentSchedule, 
    surgeonSchedules, 
    availableSlots, 
    statusFilter, 
    dateFilter 
  } = useSelector((state) => state.orScheduling);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSurgeon, setSelectedSurgeon] = useState(null);

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchOrSchedules({ institution_id: 'your-institution-id' }));
  }, [dispatch]);

  // Columns for the main schedules table
  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      key: 'patient',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <span>{text || 'Unknown'}</span>
        </Space>
      ),
    },
    {
      title: 'Procedure',
      dataIndex: 'procedure',
      key: 'procedure',
      render: (text) => text || 'Not specified',
    },
    {
      title: 'Date & Time',
      dataIndex: 'scheduled_date',
      key: 'datetime',
      render: (_, record) => (
        <Space>
          <CalendarOutlined />
          <span>{dayjs(record.scheduled_date).format('MMM D, YYYY')}</span>
          <ClockCircleOutlined />
          <span>{record.scheduled_time}</span>
        </Space>
      ),
      sorter: (a, b) => {
        const dateA = new Date(`${a.scheduled_date} ${a.scheduled_time}`);
        const dateB = new Date(`${b.scheduled_date} ${b.scheduled_time}`);
        return dateA - dateB;
      },
    },
    {
      title: 'Surgeon',
      dataIndex: ['surgeon', 'name'],
      key: 'surgeon',
      render: (text) => text || 'Not assigned',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color, icon;
        switch (status.toLowerCase()) {
          case 'scheduled':
            color = 'blue';
            icon = <SyncOutlined />;
            break;
          case 'completed':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'cancelled':
            color = 'red';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'gray';
        }
        return (
          <Tag icon={icon} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Scheduled', value: 'Scheduled' },
        { text: 'Completed', value: 'Completed' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {record.status === 'Scheduled' && (
            <>
              <Popconfirm
                title="Are you sure you want to cancel this surgery?"
                onConfirm={() => handleCancel(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger icon={<CloseCircleOutlined />}>
                  Cancel
                </Button>
              </Popconfirm>
              <Button 
                type="link" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleComplete(record.id)}
              >
                Complete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        scheduled_date: values.scheduled_date.format('YYYY-MM-DD'),
        scheduled_time: values.scheduled_time.format('HH:mm:ss'),
        institution_id: 'your-institution-id',
      };

      if (currentSchedule) {
        await dispatch(updateOrSchedule({ id: currentSchedule.id, updates: formattedValues })).unwrap();
        message.success('Schedule updated successfully');
      } else {
        await dispatch(createOrSchedule(formattedValues)).unwrap();
        message.success('Schedule created successfully');
      }

      setIsModalVisible(false);
      dispatch(clearCurrentSchedule());
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  // Handle edit action
  const handleEdit = (schedule) => {
    dispatch(fetchOrScheduleById(schedule.id));
    form.setFieldsValue({
      ...schedule,
      scheduled_date: dayjs(schedule.scheduled_date),
      scheduled_time: dayjs(schedule.scheduled_time, 'HH:mm:ss'),
    });
    setIsModalVisible(true);
  };

  // Handle cancel action
  const handleCancel = async (id) => {
    try {
      await dispatch(cancelOrSchedule({ id, cancellation_reason: 'Physician request' })).unwrap();
      message.success('Surgery cancelled successfully');
    } catch (error) {
      message.error(error.message || 'Failed to cancel surgery');
    }
  };

  // Handle complete action
  const handleComplete = async (id) => {
    try {
      await dispatch(completeSurgery({ id, notes: 'Procedure completed as planned', outcome: 'Successful' })).unwrap();
      message.success('Surgery marked as completed');
    } catch (error) {
      message.error(error.message || 'Failed to complete surgery');
    }
  };

  // Handle date change for available slots
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      dispatch(fetchAvailableTimeSlots({ 
        date: date.format('YYYY-MM-DD'), 
        institution_id: 'your-institution-id' 
      }));
    } else {
      dispatch(clearAvailableSlots());
    }
  };

  // Handle surgeon selection change
  const handleSurgeonChange = (value) => {
    setSelectedSurgeon(value);
    if (value) {
      dispatch(fetchSurgeonSchedules({ surgeon_id: value }));
    }
  };

  // Statistics data
  const statsData = [
    { title: 'Total Scheduled', value: schedules.filter(s => s.status === 'Scheduled').length, color: 'blue' },
    { title: 'Completed Today', value: schedules.filter(s => s.status === 'Completed' && dayjs(s.scheduled_date).isSame(dayjs(), 'day')).length, color: 'green' },
    { title: 'Cancelled This Week', value: schedules.filter(s => s.status === 'Cancelled' && dayjs(s.scheduled_date).isSame(dayjs(), 'week')).length, color: 'red' },
    { title: 'OR Utilization', value: '78%', color: 'purple' },
  ];

  return (
    <div className="p-4">
      <Card title="Operating Room Scheduling" bordered={false}>
        {/* Statistics Row */}
        <Row gutter={16} className="mb-6">
          {statsData.map((stat, index) => (
            <Col span={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Action Bar */}
        <div className="flex justify-between mb-4">
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                dispatch(clearCurrentSchedule());
                setIsModalVisible(true);
              }}
            >
              New Schedule
            </Button>
            <Select
              defaultValue="all"
              style={{ width: 180 }}
              onChange={(value) => dispatch(setStatusFilter(value))}
              options={statusOptions}
            />
            <DatePicker 
              onChange={(date) => dispatch(setDateFilter(date ? date.format('YYYY-MM-DD') : null))}
              allowClear
              placeholder="Filter by date"
            />
            <Button 
              icon={<SyncOutlined />} 
              onClick={() => dispatch(fetchOrSchedules({ institution_id: 'your-institution-id' }))}
            >
              Refresh
            </Button>
          </Space>

          <Space>
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
            <Button 
              type={viewMode === 'calendar' ? 'primary' : 'default'}
              onClick={() => setViewMode('calendar')}
            >
              Calendar View
            </Button>
          </Space>
        </div>

        <Divider />

        {/* Main Content Area */}
        <Tabs defaultActiveKey="1">
          <TabPane tab="All Schedules" key="1">
            {viewMode === 'list' ? (
              <Table
                columns={columns}
                dataSource={schedules}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            ) : (
              <div className="calendar-view">
                {/* Calendar view implementation would go here */}
                <p>Calendar view would show a weekly/daily schedule of OR bookings</p>
              </div>
            )}
          </TabPane>
          <TabPane tab="Surgeon Schedules" key="2">
            <div className="mb-4">
              <Select
                style={{ width: 300 }}
                placeholder="Select a surgeon"
                onChange={handleSurgeonChange}
                allowClear
              >
                {/* These would be populated with actual surgeon data */}
                <Option value="surgeon-1">Dr. Smith (Cardiothoracic)</Option>
                <Option value="surgeon-2">Dr. Johnson (Orthopedics)</Option>
                <Option value="surgeon-3">Dr. Lee (Neurosurgery)</Option>
              </Select>
            </div>
            <Table
              columns={columns}
              dataSource={surgeonSchedules}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Schedule Modal */}
      <Modal
        title={currentSchedule ? 'Edit Surgery Schedule' : 'New Surgery Schedule'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          dispatch(clearCurrentSchedule());
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'Scheduled'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Patient"
                name="patient_id"
                rules={[{ required: true, message: 'Please select a patient' }]}
              >
                <Select
                  showSearch
                  placeholder="Search patients"
                  optionFilterProp="children"
                >
                  {/* These would be populated with actual patient data */}
                  <Option value="patient-1">John Doe (MRN: 12345)</Option>
                  <Option value="patient-2">Jane Smith (MRN: 67890)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Procedure"
                name="procedure"
                rules={[{ required: true, message: 'Please enter the procedure' }]}
              >
                <Input placeholder="e.g. Laparoscopic Cholecystectomy" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="scheduled_date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  onChange={handleDateChange}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Time"
                name="scheduled_time"
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <Select
                  placeholder="Select available time"
                  notFoundContent={availableSlots.length === 0 ? 'No available slots' : null}
                >
                  {availableSlots.map((slot, index) => (
                    <Option key={index} value={slot}>
                      {slot}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Surgeon"
                name="surgeon_id"
                rules={[{ required: true, message: 'Please select a surgeon' }]}
              >
                <Select placeholder="Select surgeon">
                  <Option value="surgeon-1">Dr. Smith (Cardiothoracic)</Option>
                  <Option value="surgeon-2">Dr. Johnson (Orthopedics)</Option>
                  <Option value="surgeon-3">Dr. Lee (Neurosurgery)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Anesthesiologist"
                name="anesthesiologist_id"
                rules={[{ required: true, message: 'Please select an anesthesiologist' }]}
              >
                <Select placeholder="Select anesthesiologist">
                  <Option value="anes-1">Dr. Brown</Option>
                  <Option value="anes-2">Dr. Wilson</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea rows={3} placeholder="Any additional notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {currentSchedule ? 'Update Schedule' : 'Create Schedule'}
              </Button>
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  dispatch(clearCurrentSchedule());
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ORscheduling;