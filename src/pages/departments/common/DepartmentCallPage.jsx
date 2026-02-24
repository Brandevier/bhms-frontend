import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, message } from 'antd';
import { PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
// import DepartmentCallPanel from '../../components/department/DepartmentCallPanel';
// import IncomingCallModal from '../../components/department/IncomingCallModal';
// import VideoCallPage from '../../components/department/VideoCallPage';
// import socketService from '../../service/socketService';
import { setIncomingCall, resetCallState } from '../../../redux/slice/callSlice';
import DepartmentCallPanel from '../../../components/department/DepartmentCallPanel';
import IncomingCallModal from '../../../components/department/IncomingCallModal';
import VideoCallPage from '../../../components/department/VideoCallPage';
import socketService from '../../../service/socketService';
const { Title, Text } = Typography;

const DepartmentCallPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { currentCall, isInCall, isIncomingCallModalOpen, incomingCall, callStatus } = useSelector((state) => state.call);
  
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Initialize socket connection on mount
  useEffect(() => {
    if (currentUser?.id) {
      // Initialize socket connection
      socketService.initialize();
      
      // Register user for call notifications
      const departmentId = currentUser.staff_departments?.[0]?.department?.id;
      if (departmentId) {
        socketService.register(currentUser.id, departmentId);
      }
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [currentUser]);

  // Handle call status changes
  useEffect(() => {
    if (callStatus === 'connected' && currentCall) {
      setShowVideoCall(true);
    }
  }, [callStatus, currentCall]);

  const handleCallInitiated = (callData) => {
    console.log('Call initiated:', callData);
    message.info('Calling...');
  };

  const handleCallEnded = () => {
    setShowVideoCall(false);
    dispatch(resetCallState());
    message.success('Call ended');
  };

  const handleIncomingCallClose = () => {
    // Just close the modal, don't reject the call
  };

  // If in an active call, show video call page
  if (showVideoCall && currentCall) {
    return (
      <div style={{ height: '100vh', padding: 24, background: '#f0f2f5' }}>
        <VideoCallPage 
          currentUser={currentUser} 
          onCallEnded={handleCallEnded}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          {/* Department Call Panel */}
          <Card>
            <DepartmentCallPanel 
              currentUser={currentUser}
              onCallInitiated={handleCallInitiated}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          {/* Quick Info Card */}
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <PhoneOutlined style={{ fontSize: 36, color: 'white' }} />
              </div>
              <Title level={4}>Inter-Department Calls</Title>
              <Text type="secondary">
                Connect with staff from other departments via audio or video call
              </Text>
            </div>
          </Card>

          {/* Instructions Card */}
          <Card title="How to Use">
            <div style={{ padding: '0 12px' }}>
              <div style={{ marginBottom: 16 }}>
                <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <Text>Select a department or staff member from the panel</Text>
              </div>
              <div style={{ marginBottom: 16 }}>
                <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <Text>Choose between audio or video call</Text>
              </div>
              <div>
                <PhoneOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                <Text>Wait for the recipient to accept your call</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Incoming Call Modal */}
      <IncomingCallModal 
        visible={isIncomingCallModalOpen}
        onClose={handleIncomingCallClose}
        currentUser={currentUser}
      />
    </div>
  );
};

export default DepartmentCallPage;
