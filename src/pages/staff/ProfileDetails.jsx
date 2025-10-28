import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/slice/authSlice';
import { 
  Card, 
  Tabs, 
  Button, 
  Row, 
  Col,
  message,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  BarChartOutlined,
  PlusOutlined
} from '@ant-design/icons';

import ProfileSidebar from './common/ProfileSidebar';
import LeaveRequestModal from './common/LeaveRequestModal';
import StatsOverview from './common/StatsOverview';
import LeaveTable from './common/LeaveTable';
import AppointmentTable from './common/AppointmentTable';
import AttendanceChart from './common/AttendanceChart';
import AttendanceTable from './common/AttendanceTable';
import { useLeave } from '../../redux/hooks/useLeave';
 

const { TabPane } = Tabs;

const ProfileDetails = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  
  // Use the leave hook
  const {
    leaves,
    loading: leaveLoading,
    error: leaveError,
    success: leaveSuccess,
    requestNewLeave,
    getMyLeaves,
    clearLeaveError,
    clearLeaveSuccess
  } = useLeave();

  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  useEffect(() => {
    // Fetch leaves when component mounts or when leaves tab is active
    if (user) {
      getMyLeaves();
    }
  }, [user, getMyLeaves]);

  useEffect(() => {
    // Handle leave request success
    if (leaveSuccess) {
      message.success('Leave request submitted successfully!');
      clearLeaveSuccess();
      setLeaveModalVisible(false);
    }
  }, [leaveSuccess, clearLeaveSuccess]);

  useEffect(() => {
    // Handle leave request errors
    if (leaveError) {
      message.error(leaveError.message || 'Failed to submit leave request');
      clearLeaveError();
    }
  }, [leaveError, clearLeaveError]);

  const handleCreateLeave = async (values) => {
    try {
      // Transform the data to match the API expectations
      const leaveData = {
        leaveType: values.leaveType,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        // Include emergency contact if provided
        ...(values.emergencyContact && { emergencyContact: values.emergencyContact }),
        // Include document if uploaded (you'll need to handle file upload separately)
        ...(values.document && { document: values.document })
      };

      await requestNewLeave(leaveData);
    } catch (error) {
      // Error is handled by the Redux slice and useEffect above
      console.error('Leave request error:', error);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Refresh leaves data when switching to leaves tab
    if (key === 'leaves' && user) {
      getMyLeaves();
    }
  };

  if (authLoading || !user) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  // Mock data for other tabs (appointments, etc.)
  const appointments = [
    {
      id: '1',
      patientName: 'John Smith',
      date: '2023-06-10',
      time: '09:30',
      type: 'Consultation',
      status: 'Completed'
    },
    // ... other appointments
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileSidebar user={user} />
          
          <div className="w-full md:w-3/4">
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              tabBarExtraContent={
                activeTab === 'leaves' && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setLeaveModalVisible(true)}
                    loading={leaveLoading}
                  >
                    Request Leave
                  </Button>
                )
              }
            >
              <TabPane tab={<span><UserOutlined /> Overview</span>} key="overview">
                <StatsOverview />
                <Card title="Attendance Trend" className="mb-6">
                  <AttendanceChart />
                </Card>
                <Row gutter={16}>
                  <Col span={24}>
                    <Card title="Recent Leaves" className="h-full">
                      {leaveLoading ? (
                        <div className="flex justify-center py-8">
                          <Spin />
                        </div>
                      ) : (
                        <LeaveTable data={leaves.slice(0, 3)} />
                      )}
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="Upcoming Appointments" className="h-full">
                      <AppointmentTable data={appointments.filter(a => a.status === 'Scheduled')} />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={<span><CalendarOutlined /> Leaves</span>} key="leaves">
                {leaveLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin />
                  </div>
                ) : (
                  <LeaveTable data={leaves} />
                )}
              </TabPane>

              <TabPane tab={<span><ClockCircleOutlined /> Appointments</span>} key="appointments">
                <AppointmentTable data={appointments} />
              </TabPane>

              <TabPane tab={<span><BarChartOutlined /> Attendance</span>} key="attendance">
                <Card title="Monthly Attendance Overview" className="mb-6">
                  <AttendanceChart />
                </Card>
                <Card title="Attendance Details">
                  <AttendanceTable />
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Card>

      <LeaveRequestModal
        visible={leaveModalVisible}
        onCancel={() => setLeaveModalVisible(false)}
        onCreate={handleCreateLeave}
        loading={leaveLoading}
      />
    </div>
  );
};

export default ProfileDetails;