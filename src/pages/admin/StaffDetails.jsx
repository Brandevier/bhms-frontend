// components/staff/StaffDetails.js
import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Modal, Popconfirm, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleStaff, deleteStaff } from '../../redux/slice/staff_admin_managment_slice';
import StaffProfileCard from './common/StaffProfileCard';
import StatisticsCards from './common/StatisticsCards';
import AttendanceList from './common/AttendanceList';
import RecentActivity from './common/RecentActivity';
import StaffDepartments from './common/StaffDepartments';
import StaffAppointments from './common/StaffAppointments';
import StaffLeaves from './common/StaffLeaves';
import StaffPerformance from './common/StaffPerformance';
import StaffDocuments from './common/StaffDocuments';

const { TabPane } = Tabs;

const StaffDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { singleStaff, loading } = useSelector((state) => state.adminStaffManagement);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    dispatch(getSingleStaff({ staffId: id }));
  }, [dispatch, id]);

  const handleSave = ()=>{
     dispatch(getSingleStaff({ staffId: id }));
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteStaff({ staff_id: id })).unwrap();
      message.success('Staff member deleted successfully');
      navigate('/admin/staffs');
    } catch (error) {
      message.error('Failed to delete staff member');
    } finally {
      setDeleteConfirmVisible(false);
    }
  };

  const handleResetPassword = () => {
    Modal.info({
      title: 'Reset Password',
      content: 'Password reset functionality will be implemented here',
      okText: 'OK'
    });
  };

  if (loading || !singleStaff) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const { staff } = singleStaff;
  const { attendance = [] } = staff;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Row gutter={[16, 16]}>
        {/* Left Side: Staff Profile */}
        <Col xs={24} md={8} lg={6}>
          <StaffProfileCard
            staff={staff}
            onResetPassword={handleResetPassword}
            onDelete={() => setDeleteConfirmVisible(true)}
          />
        </Col>

        {/* Right Side: Dashboard Stats & Details */}
        <Col xs={24} md={16} lg={18}>
          <StatisticsCards staff={staff} attendance={attendance} />
          
          <Tabs defaultActiveKey="overview" className="mt-6">
            <TabPane tab="Overview" key="overview">
              <AttendanceList attendance={attendance} />
              <RecentActivity staff={staff} attendance={attendance} />
            </TabPane>
            
            <TabPane tab="Access Departments" key="departments">
              <StaffDepartments staffId={id} staffName={`${staff.firstName} ${staff.lastName}`} current_departments={singleStaff?.staff_departments || []} onSave={handleSave}/>
            </TabPane>

            <TabPane tab="Staff Roles" key="roles">
             <span>This are the staff roles</span>
            </TabPane>
            
            <TabPane tab="Appointments" key="appointments">
              <StaffAppointments appointments={singleStaff?.appointments || []} />
            </TabPane>
            
            <TabPane tab="Leaves" key="leaves">
              <StaffLeaves staffId={id} staffName={`${staff.firstName} ${staff.lastName}`} />
            </TabPane>
            
            <TabPane tab="Performance" key="performance">
              <StaffPerformance staffId={id} staffName={`${staff.firstName} ${staff.lastName}`} />
            </TabPane>
            
            <TabPane tab="Documents" key="documents">
              <StaffDocuments staffId={id} staffName={`${staff.firstName} ${staff.lastName}`} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Popconfirm
        title="Are you sure to delete this staff member?"
        open={deleteConfirmVisible}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="Yes"
        cancelText="No"
        placement="bottom"
      >
        <span></span>
      </Popconfirm>
    </div>
  );
};

export default StaffDetails;