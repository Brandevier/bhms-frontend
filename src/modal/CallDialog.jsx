import { Modal, Button, Avatar, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { CallContext } from '../context/CallContext';
import { getSocket } from '../service/socketService';
import { 
  PhoneOutlined, 
  PhoneFilled, 
  UserOutlined, 
  AudioOutlined,
  AudioMutedOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const CallDialog = () => {
  const { incomingCall, showCallDialog, setShowCallDialog, setIncomingCall } = useContext(CallContext);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('ringing'); // 'ringing', 'active', 'ended'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    let timer;
    if (showCallDialog && callStatus === 'active') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showCallDialog, callStatus]);

  const handleAccept = () => {
    const socket = getSocket();
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }
    
    socket.emit('answer-department-call', { 
      callId: incomingCall.callId,
      answererId: incomingCall.answererId
    });
    setCallStatus('active');
  };

  const handleReject = () => {
    const socket = getSocket();
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }
    
    socket.emit('reject-department-call', { 
      callId: incomingCall.callId,
      reason: 'User rejected the call'
    });
    endCall();
  };

  const handleEndCall = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('end-department-call', { callId: incomingCall.callId });
    }
    endCall();
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setShowCallDialog(false);
      setIncomingCall(null);
      setCallStatus('ringing');
      setCallDuration(0);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showCallDialog || !incomingCall) return null;

  return (
    <Modal
      title={callStatus === 'ringing' ? 'Incoming Department Call' : 'Ongoing Call'}
      visible={showCallDialog}
      onCancel={handleReject}
      footer={null}
      closable={false}
      width={callStatus === 'ringing' ? 400 : 600}
      className="call-modal"
      bodyStyle={{ padding: 0 }}
    >
      <div className={`flex flex-col items-center justify-center ${callStatus === 'active' ? 'bg-gray-900 text-white' : 'bg-white'}`}
           style={{ minHeight: '300px' }}>
        
        {callStatus === 'ringing' ? (
          <div className="p-6 text-center">
            <Avatar 
              size={80} 
              src={incomingCall.callerAvatar} 
              icon={<UserOutlined />}
              className="mb-4"
            />
            <Text strong className="text-xl block">{incomingCall.callerName}</Text>
            <Text type="secondary" className="block mb-6">is calling your department</Text>
            
            <div className="flex justify-center space-x-4">
              <Button
                type="primary"
                danger
                shape="circle"
                size="large"
                icon={<CloseOutlined />}
                onClick={handleReject}
                className="w-16 h-16 flex items-center justify-center"
              />
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<PhoneFilled />}
                onClick={handleAccept}
                className="w-16 h-16 flex items-center justify-center bg-green-500 hover:bg-green-600 border-green-500"
              />
            </div>
          </div>
        ) : callStatus === 'active' ? (
          <div className="w-full p-6">
            <div className="flex flex-col items-center mb-8">
              <Avatar 
                size={100} 
                src={incomingCall.callerAvatar} 
                icon={<UserOutlined />}
                className="mb-4 border-2 border-white"
              />
              <Text strong className="text-2xl mb-1">{incomingCall.callerName}</Text>
              <Text className="text-lg">{formatDuration(callDuration)}</Text>
              <Text type="secondary" className="mt-2">Department: {incomingCall.departmentId}</Text>
            </div>

            {/* Video/Audio placeholder - would be replaced with actual stream */}
            <div className="bg-gray-800 rounded-lg mb-6 h-48 flex items-center justify-center">
              {isVideoOn ? (
                <VideoCameraAddOutlined className="text-4xl text-gray-400" />
              ) : (
                <div className="text-center">
                  <Avatar 
                    size={64} 
                    src={incomingCall.callerAvatar} 
                    icon={<UserOutlined />}
                    className="mb-2"
                  />
                  <Text className="text-gray-400">Video is off</Text>
                </div>
              )}
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
                type={isVideoOn ? 'primary' : 'default'}
                shape="circle"
                size="large"
                icon={isVideoOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="w-12 h-12 flex items-center justify-center"
              />
              <Button
                type="primary"
                danger
                shape="circle"
                size="large"
                icon={<PhoneOutlined />}
                onClick={handleEndCall}
                className="w-12 h-12 flex items-center justify-center"
              />
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <Text strong className="text-xl block mb-4">Call ended</Text>
            <Text className="block">Duration: {formatDuration(callDuration)}</Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CallDialog;