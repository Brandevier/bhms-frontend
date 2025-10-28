// Update your FaceScanAttendance component
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import FaceRegistrationModal from './common/FaceRegistrationModal';
import FaceScanModal from './common/FaceScanModal';
import AttendanceTable from './common/AttendanceTable';

const { Title, Text } = Typography;

const FaceScanAttendance = () => {
  const { user } = useSelector((state) => state.auth);
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (user && !user.has_face_registered) {
      setShowRegistrationPrompt(true);
    }
  }, [user]);

  const handleAttendanceDataLoaded = (data) => {
    setAttendanceData(data);
  };

  return (
    <>
      <FaceRegistrationModal
        visible={registrationModalVisible}
        onClose={() => setRegistrationModalVisible(false)}
        user={user}
      />
      
      <FaceScanModal
        visible={scanModalVisible}
        onClose={() => setScanModalVisible(false)}
        user={user}
      />

      <div className="p-6">
        <Card title="Face Scan Attendance">
          {showRegistrationPrompt && (
            <Alert
              message="Face Registration Required"
              description="You need to register your face before using the attendance features."
              type="warning"
              showIcon
              className="mb-4"
              action={
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => setRegistrationModalVisible(true)}
                >
                  Register Now
                </Button>
              }
            />
          )}
          
          <div className="text-center py-8">
            <UserOutlined className="text-4xl text-blue-500 mb-4" />
            <Title level={3}>Face Recognition Attendance</Title>
            <Text className="text-gray-600">
              {user?.has_face_registered
                ? 'Use face recognition to mark your attendance'
                : 'Please register your face to use attendance features'}
            </Text>
            
            {!user?.has_face_registered ? (
              <Button
                type="primary"
                size="large"
                className="mt-4"
                onClick={() => setRegistrationModalVisible(true)}
              >
                Register Face Now
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<CameraOutlined />}
                className="mt-4"
                onClick={() => setScanModalVisible(true)}
              >
                Take Attendance Now
              </Button>
            )}
          </div>
        </Card>

        {user?.department_id && (
          <div className="mt-6">
            <Card 
              title="Department Attendance" 
              extra={
                attendanceData.length === 0 && user?.has_face_registered && (
                  <Button 
                    type="primary" 
                    icon={<CameraOutlined />}
                    onClick={() => setScanModalVisible(true)}
                  >
                    Take First Attendance
                  </Button>
                )
              }
            >
              <AttendanceTable 
                user={user} 
                departmentId={user.department_id}
                onDataLoaded={handleAttendanceDataLoaded}
                emptyComponent={
                  attendanceData.length === 0 && user?.has_face_registered && (
                    <div className="text-center py-8">
                      <Text className="text-gray-600 block mb-4">
                        No attendance records found. Take your first attendance to get started.
                      </Text>
                      <Button 
                        type="primary" 
                        icon={<CameraOutlined />}
                        size="large"
                        onClick={() => setScanModalVisible(true)}
                      >
                        Take Your First Attendance
                      </Button>
                    </div>
                  )
                }
              />
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default FaceScanAttendance;