import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Row, 
  Col,
  Statistic,
  Tabs,
  Divider,
  Space,
  Select,
  DatePicker,
  message
} from 'antd';
import { 
  PlusOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchOrSchedules,
  fetchSurgeonSchedules,
  setStatusFilter,
  setDateFilter,
  clearCurrentSchedule
} from '../../../redux/slice/ORSlice';
import dayjs from 'dayjs';


import ScheduleModal from './Pre-Op Management/components/ScheduleModal';
import AllSchedulesTab from './Pre-Op Management/components/AllSchedulesTab';
import SurgeonSchedulesTab from './Pre-Op Management/components/SurgeonSchedulesTab';


const { TabPane } = Tabs;

const ORscheduling = () => {
  const dispatch = useDispatch();
  const { 
    loading, 
    schedules, 
    currentSchedule, 
    surgeonSchedules, 
    statusFilter, 
    dateFilter 
  } = useSelector((state) => state.orScheduling);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('list');

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

  // Handle edit action
  const handleEdit = (schedule) => {
    dispatch(fetchOrScheduleById(schedule.id));
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

  // Handle surgeon selection change
  const handleSurgeonChange = (value) => {
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
            <AllSchedulesTab 
              loading={loading}
              schedules={schedules}
              viewMode={viewMode}
              handleEdit={handleEdit}
              handleCancel={handleCancel}
              handleComplete={handleComplete}
            />
          </TabPane>
          <TabPane tab="Surgeon Schedules" key="2">
            <SurgeonSchedulesTab 
              loading={loading}
              surgeonSchedules={surgeonSchedules}
              handleSurgeonChange={handleSurgeonChange}
            />
          </TabPane>
        </Tabs>
      </Card>

      <ScheduleModal 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        currentSchedule={currentSchedule}
      />
    </div>
  );
};

export default ORscheduling;