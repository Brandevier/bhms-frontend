import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Card, 
  Spin, 
  Typography, 
  Row, 
  Col,
  Tag,
  Divider,
  Empty
} from 'antd';
import { 
  QrcodeOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceByDepartment, getLatestQrCode } from '../redux/slice/qrAttendanceSlice';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Attendance = () => {
  const dispatch = useDispatch();
  const { loading, attendanceRecords, qrCodeImage } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getAttendanceByDepartment(user.department_id));
    dispatch(getLatestQrCode());
  }, [dispatch, user.department_id]);

  const columns = [
    {
      title: 'Staff Member', 
      dataIndex: 'staff',
      key: 'staff',
      render: (staff) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span>{staff?.name || 'Unknown'}</span>
        </div>
      ),
    },
    {
      title: 'Sign In',
      dataIndex: 'signInTime',
      key: 'signInTime',
      render: (time) => time ? dayjs(time).format('h:mm A') : <Tag color="default">Not signed in</Tag>,
    },
    {
      title: 'Sign Out',
      dataIndex: 'signOutTime',
      key: 'signOutTime',
      render: (time) => time ? dayjs(time).format('h:mm A') : <Tag color="error">Not signed out</Tag>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        record.signInTime && record.signOutTime ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Completed
          </Tag>
        ) : record.signInTime ? (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Working
          </Tag>
        ) : (
          <Tag color="default">Absent</Tag>
        )
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Department Attendance
          </Title>
          <Text type="secondary">
            {dayjs().format('dddd, MMMM D, YYYY')}
          </Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<QrcodeOutlined />} 
            onClick={showModal}
            size="large"
          >
            Take Attendance
          </Button>
        </Col>
      </Row>

      <Divider />

      <Card bordered={false}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : attendanceRecords?.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={attendanceRecords} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No attendance records found"
          />
        )}
      </Card>

      <Modal
        title="Scan QR Code for Attendance"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
      >
        {qrCodeImage ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <img 
              src={qrCodeImage} 
              alt="Attendance QR Code" 
              style={{ width: '100%', maxWidth: '300px' }}
            />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
              Scan this code to mark your attendance
            </Text>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">No QR code available. Please try again later.</Text>
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default Attendance;