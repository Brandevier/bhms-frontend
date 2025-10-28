import React, { useEffect, useState } from 'react';
import { Modal, Avatar, Typography, Button } from 'antd';
import { 
  PhoneOutlined, 
  UserOutlined, 
  AudioOutlined,
  AudioMutedOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const DepartmentCallModal = ({ 
  department, 
  visible, 
  onEndCall, 
  callerInfo,
  socket,
  isCaller = false // Add this prop to distinguish caller/answerer
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState(isCaller ? 'calling' : 'answering');
  const [isMuted, setIsMuted] = useState(false);
  const [remoteUser, setRemoteUser] = useState(null);

  useEffect(() => {
    let timer;
    if (visible && callStatus === 'in-call') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [visible, callStatus]);

  useEffect(() => {
    if (!socket) return;

    // For Caller: Listen for answer
    const handleCallAccepted = (data) => {
      setRemoteUser({
        id: data.answererId,
        name: 'Department Staff' // You might want to get actual name
      });
      setCallStatus('in-call');
    };

    // For Answerer: Confirm answer success
    const handleCallAnswered = (data) => {
      setRemoteUser({
        id: data.callerId,
        name: data.callerName || 'Caller'
      });
      setCallStatus('in-call');
    };

    socket.on('department-call-accepted', handleCallAccepted);
    socket.on('department-call-answered', handleCallAnswered);

    return () => {
      socket.off('department-call-accepted', handleCallAccepted);
      socket.off('department-call-answered', handleCallAnswered);
    };
  }, [socket]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerCall = () => {
    socket.emit('answer-department-call', { 
      callId: department.callId,
      answererId: callerInfo.id 
    });
  };

  if (!visible || !department) return null;

  return (
    <Modal
      title={
        callStatus === 'calling' ? `Calling ${department.name}` :
        callStatus === 'answering' ? `Incoming Call from ${remoteUser?.name}` :
        `Call with ${remoteUser?.name || department.name}`
      }
      visible={visible}
      onCancel={onEndCall}
      footer={null}
      closable={false}
      width={callStatus === 'in-call' ? 500 : 400}
      className="call-modal"
      bodyStyle={{ padding: 0 }}
    >
      <div className={`flex flex-col items-center justify-center ${callStatus === 'in-call' ? 'bg-gray-900 text-white' : 'bg-white'}`}
           style={{ minHeight: '300px' }}>
        
        {callStatus === 'calling' ? (
          <div className="p-6 text-center">
            <Avatar 
              size={80} 
              src={department.avatar || '/assets/dept-default.png'}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <Text strong className="text-xl block">Calling {department.name}</Text>
            <Text type="secondary" className="block mb-6">Waiting for response...</Text>
            
            <Button
              type="primary"
              danger
              size="large"
              icon={<CloseOutlined />}
              onClick={onEndCall}
            >
              End Call
            </Button>
          </div>
        ) : callStatus === 'answering' ? (
          <div className="p-6 text-center">
            <Avatar 
              size={80} 
              src={remoteUser?.avatar || '/assets/user.png'}
              icon={<UserOutlined />}
              className="mb-4"
            />
            <Text strong className="text-xl block">Incoming Call</Text>
            <Text type="secondary" className="block mb-6">{remoteUser?.name} is calling</Text>
            
            <div className="flex justify-center space-x-4">
              <Button
                type="primary"
                danger
                size="large"
                icon={<CloseOutlined />}
                onClick={onEndCall}
              >
                Reject
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PhoneOutlined />}
                onClick={handleAnswerCall}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Answer
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full p-6">
            <div className="flex flex-col items-center mb-8">
              <Avatar 
                size={100} 
                src={remoteUser?.avatar || (isCaller ? department.avatar : '/assets/user.png')}
                icon={<UserOutlined />}
                className="mb-4 border-2 border-white"
              />
              <Text strong className="text-2xl mb-1">
                {isCaller ? department.name : remoteUser?.name}
              </Text>
              <Text className="text-lg">{formatDuration(callDuration)}</Text>
            </div>

            {/* Call controls */}
            <div className="flex justify-center space-x-4">
              <Button
                type={isMuted ? 'default' : 'primary'}
                shape="circle"
                size="large"
                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 flex items-center justify-center"
              />
              <Button
                type="primary"
                danger
                shape="circle"
                size="large"
                icon={<CloseOutlined />}
                onClick={onEndCall}
                className="w-12 h-12 flex items-center justify-center"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DepartmentCallModal;