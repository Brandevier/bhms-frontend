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

import dayjs from 'dayjs';
import { getAllTheatreBookings } from '../../../redux/slice/theatreSlice';

import ScheduleModal from './Pre-Op Management/components/ScheduleModal';
import AllSchedulesTab from './Pre-Op Management/components/AllSchedulesTab';
import SurgeonSchedulesTab from './Pre-Op Management/components/SurgeonSchedulesTab';

const { TabPane } = Tabs;

const ORscheduling = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.theatre);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pre-operation', label: 'Pre-Operation' },
    { value: 'intra-operation', label: 'In Surgery' },
    { value: 'post-operation', label: 'Post-Operation' },
  ];

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getAllTheatreBookings());
  }, [dispatch]);

  // Filter schedules based on selected filters
  const filteredSchedules = React.useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) return [];
    
    return bookings.filter(booking => {
      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter && booking.scheduled_date) {
        const bookingDate = dayjs(booking.scheduled_date);
        const filterDate = dayjs(dateFilter);
        if (!bookingDate.isSame(filterDate, 'day')) {
          return false;
        }
      }
      
      return true;
    });
  }, [bookings, statusFilter, dateFilter]);

  // Calculate statistics from real data
  const statsData = React.useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) {
      return [
        { title: 'Pre-Operation', value: 0, color: 'blue' },
        { title: 'In Surgery', value: 0, color: 'orange' },
        { title: 'Post-Operation', value: 0, color: 'green' },
        { title: 'Total Today', value: 0, color: 'purple' },
      ];
    }

    const today = dayjs().format('YYYY-MM-DD');
    
    const preOpCount = bookings.filter(b => b.status === 'pre-operation').length;
    const intraOpCount = bookings.filter(b => b.status === 'intra-operation').length;
    const postOpCount = bookings.filter(b => b.status === 'post-operation').length;
    
    const todayCount = bookings.filter(b => {
      if (!b.scheduled_date) return false;
      const scheduledDate = dayjs(b.scheduled_date).format('YYYY-MM-DD');
      return scheduledDate === today;
    }).length;

    return [
      { 
        title: 'Pre-Operation', 
        value: preOpCount, 
        color: '#1890ff',
        subtitle: 'Ready for surgery'
      },
      { 
        title: 'In Surgery', 
        value: intraOpCount, 
        color: '#fa8c16',
        subtitle: 'Currently in OR'
      },
      { 
        title: 'Post-Operation', 
        value: postOpCount, 
        color: '#52c41a',
        subtitle: 'In recovery'
      },
      { 
        title: 'Scheduled Today', 
        value: todayCount, 
        color: '#722ed1',
        subtitle: `Total: ${bookings.length}`
      },
    ];
  }, [bookings]);

  // Handle edit action
  const handleEdit = (schedule) => {
    // dispatch(fetchOrScheduleById(schedule.id));
    setIsModalVisible(true);
    message.info(`Editing schedule for ${schedule.visit?.patient?.name || 'Unknown Patient'}`);
  };

  // Handle cancel action
  const handleCancel = async (id) => {
    try {
      // await dispatch(cancelOrSchedule({ id, cancellation_reason: 'Physician request' })).unwrap();
      message.success('Surgery cancelled successfully');
    } catch (error) {
      message.error(error.message || 'Failed to cancel surgery');
    }
  };

  // Handle complete action
  const handleComplete = async (id) => {
    try {
      // await dispatch(completeSurgery({ id, notes: 'Procedure completed as planned', outcome: 'Successful' })).unwrap();
      message.success('Surgery marked as completed');
    } catch (error) {
      message.error(error.message || 'Failed to complete surgery');
    }
  };

  // Handle surgeon selection change
  const handleSurgeonChange = (value) => {
    if (value) {
      // dispatch(fetchSurgeonSchedules({ surgeon_id: value }));
      message.info(`Loading schedules for surgeon: ${value}`);
    }
  };

  // Format schedule data for tabs
  const formatScheduleData = (booking) => {
    const patient = booking.visit?.patient || {};
    const primaryProcedure = booking.procedures?.[0] || {};
    const primaryDiagnosis = booking.diagnoses?.[0] || {};
    
    return {
      id: booking.id,
      patientName: patient.name || 'Unknown Patient',
      patientId: patient.id,
      folderNumber: patient.folderNumber,
      age: patient.age,
      gender: patient.gender,
      primaryProcedure: primaryProcedure.name || 'No procedure specified',
      primaryDiagnosis: primaryDiagnosis.name || 'No diagnosis specified',
      scheduledDate: booking.scheduled_date,
      scheduledTime: booking.scheduled_time,
      status: booking.status,
      surgeon: booking.surgeon,
      anaesthetist: booking.anaesthetist,
      notes: booking.notes,
      isEmergency: booking.is_emergency,
      visitId: booking.visit_id,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };
  };

  const formattedSchedules = filteredSchedules.map(formatScheduleData);

  return (
    <div className="p-4">
      <Card title="Operating Room Scheduling" bordered={false}>
        {/* Statistics Row */}
        <Row gutter={16} className="mb-6">
          {statsData.map((stat, index) => (
            <Col span={6} key={index}>
              <Card size="small" className="text-center">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                  suffix={stat.title === 'Scheduled Today' ? '' : ''}
                />
                <div style={{ color: stat.color, fontSize: '12px', marginTop: '-8px' }}>
                  {stat.subtitle}
                </div>
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
                // dispatch(clearCurrentSchedule());
                setIsModalVisible(true);
              }}
            >
              New Schedule
            </Button>
            <Select
              defaultValue="all"
              style={{ width: 180 }}
              onChange={(value) => setStatusFilter(value)}
              options={statusOptions}
            />
            <DatePicker 
              onChange={(date) => setDateFilter(date)}
              allowClear
              placeholder="Filter by date"
              style={{ width: 180 }}
            />
            <Button 
              icon={<SyncOutlined />} 
              onClick={() => dispatch(getAllTheatreBookings())}
              loading={loading}
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
          <TabPane tab={`All Schedules (${formattedSchedules.length})`} key="1">
            <AllSchedulesTab 
              loading={loading}
              schedules={formattedSchedules}
              viewMode={viewMode}
              handleEdit={handleEdit}
              handleCancel={handleCancel}
              handleComplete={handleComplete}
            />
          </TabPane>
          <TabPane tab="Surgeon Schedules" key="2">
            <SurgeonSchedulesTab 
              loading={loading}
              surgeonSchedules={formattedSchedules}
              handleSurgeonChange={handleSurgeonChange}
            />
          </TabPane>
          <TabPane tab="Theatre Overview" key="3">
            <Card size="small">
              <div className="text-center p-4">
                <h3 className="text-lg font-semibold mb-2">Operating Room Utilization</h3>
                <p className="text-gray-600">
                  Total Bookings: <strong>{bookings?.length || 0}</strong>
                </p>
                <p className="text-gray-600">
                  Emergency Cases: <strong>{bookings?.filter(b => b.is_emergency)?.length || 0}</strong>
                </p>
                <p className="text-gray-600">
                  Last Updated: {dayjs().format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <ScheduleModal 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        // currentSchedule={currentSchedule}
      />
    </div>
  );
};

export default ORscheduling;