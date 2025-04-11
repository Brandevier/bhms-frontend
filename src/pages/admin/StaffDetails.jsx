import React, { useEffect } from "react";
import { 
  Card, 
  Col, 
  Row, 
  Avatar, 
  Tag, 
  Statistic, 
  Typography, 
  Divider, 
  List, 
  Spin, 
  Button, 
  Popconfirm, 
  message,
  Space
} from "antd";
import { 
  PhoneOutlined, 
  MailOutlined, 
  ClockCircleOutlined,
  DeleteOutlined,
  KeyOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getSingleStaff, deleteStaff } from "../../redux/slice/staff_admin_managment_slice";

const { Title, Text } = Typography;

const StaffDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { singleStaff, loading } = useSelector((state) => state.adminStaffManagement);

  useEffect(() => {
    dispatch(getSingleStaff({ staffId: id }));
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteStaff({staff_id:id,})).unwrap();
      message.success('Staff member deleted successfully');
      navigate('/admin/staff'); // Redirect to staff list after deletion
    } catch (error) {
      message.error('Failed to delete staff member');
    }
  };

  const handleResetPassword = () => {
    // Implement password reset logic here
    message.info('Password reset functionality will be implemented here');
  };

  if (loading || !singleStaff) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />;
  }

  const { staff } = singleStaff;
  const { firstName, lastName, email, phone_number, department, role, attendance } = staff;

  // Function to determine time of day
  const getTimeOfDay = (timeString) => {
    const hour = moment(timeString).hour();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    return 'Night';
  };

  // Format attendance data
  const formattedAttendance = attendance.map(entry => ({
    id: entry.id,
    date: moment(entry.scannedAt).format('YYYY-MM-DD'),
    day: moment(entry.scannedAt).format('dddd'),
    time: moment(entry.scannedAt).format('h:mm A'),
    period: getTimeOfDay(entry.scannedAt)
  }));

  return (
    <div style={{ padding: 20, background: "#F5F7FA" }}>
      <Row gutter={[16, 16]}>
        {/* Left Side: Staff Profile */}
        <Col xs={24} md={8} lg={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Avatar size={100} src="/assets/user.png" />
              <Title level={4} style={{ marginTop: 10 }}>{firstName} {lastName}</Title>
              <Text type="secondary">{role?.name}</Text>
              <div style={{ marginTop: 10 }}>
                <Tag color="green">Active</Tag>
              </div>
            </div>
            <Divider />
            
            <Text strong>Department:</Text>
            <p>{department?.name}</p>
            
            <Text strong>Staff ID:</Text>
            <p>{staff.staffID}</p>
            
            <Divider />
            
            <div>
              <p>
                <PhoneOutlined /> {phone_number}
              </p>
              <p>
                <MailOutlined /> {email}
              </p>
            </div>

            {/* Action Buttons - Placed at the bottom of the profile card */}
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<KeyOutlined />} 
                block
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
              <Popconfirm
                title="Are you sure to delete this staff member?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                placement="bottom"
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  block
                >
                  Delete Staff
                </Button>
              </Popconfirm>
            </Space>
          </Card>
        </Col>

        {/* Right Side: Dashboard Stats & Details */}
        <Col xs={24} md={16} lg={18}>
          <Row gutter={[16, 16]}>
            {/* Statistics */}
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Total Attendance" value={attendance.length} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic 
                  title="Last Login" 
                  value={moment(staff.last_login).format('MMM D, YYYY')}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic 
                  title="Account Created" 
                  value={moment(staff.created_at).format('MMM D, YYYY')}
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Attendance Section */}
          <Card title="Attendance Records">
            <List
              dataSource={formattedAttendance}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                      <Text strong>{item.date}</Text>
                      <Text type="secondary" style={{ display: 'block' }}>{item.day}</Text>
                    </div>
                    <div>
                      <Text>{item.time}</Text>
                      <Tag 
                        color={
                          item.period === 'Morning' ? 'gold' : 
                          item.period === 'Afternoon' ? 'orange' : 'purple'
                        }
                        style={{ marginLeft: 8 }}
                      >
                        {item.period}
                      </Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Recent Activity Section */}
          <Card title="Recent Activity">
            <List
              dataSource={[
                { action: "Logged in", time: staff.last_login },
                { action: "Account created", time: staff.created_at },
                ...attendance.slice(0, 3).map(entry => ({
                  action: "Attendance marked",
                  time: entry.scannedAt
                }))
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined />}
                    title={item.action}
                    description={moment(item.time).format('MMMM Do YYYY, h:mm:ss a')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffDetails;