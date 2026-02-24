import React, { useEffect, useRef } from 'react';
import { Modal, Button, Avatar, Typography, Space, Badge, Card } from 'antd';
import { 
  PhoneOutlined, 
  PhoneTwoTone as PhoneInPickedOutlined, 
  PushpinOutlined as PhoneInTalkOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearIncomingCall, setCallStatus, setCurrentCall } from '../../redux/slice/callSlice';
import socketService from '../../service/socketService';

const { Text, Title } = Typography;

const IncomingCallModal = ({ visible, onClose, currentUser }) => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const { incomingCall, isIncomingCallModalOpen } = useSelector((state) => state.call);

  // Play ringtone when modal opens
  useEffect(() => {
    if (isIncomingCallModalOpen && incomingCall) {
      // Try to play a notification sound
      try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        // Repeat the beep
        let count = 0;
        const interval = setInterval(() => {
          if (count >= 3 || !isIncomingCallModalOpen) {
            clearInterval(interval);
            oscillator.stop();
            return;
          }
          oscillator.start();
          setTimeout(() => oscillator.stop(), 200);
          count++;
        }, 600);
      } catch (e) {
        console.log('Audio not available');
      }
    }
  }, [isIncomingCallModalOpen, incomingCall]);

  const handleAccept = async () => {
    if (!incomingCall) return;

    // Accept via socket
    socketService.acceptCall(incomingCall.id);
    
    // Update Redux state
    dispatch(setCallStatus('connected'));
    dispatch(setCurrentCall({ ...incomingCall, status: 'accepted' }));
    
    // Close modal
    dispatch(clearIncomingCall());
  };

  const handleReject = () => {
    if (!incomingCall) return;

    // Reject via socket
    socketService.rejectCall(incomingCall.id, 'Declined by user');
    
    // Update Redux state
    dispatch(setCallStatus('ended'));
    
    // Close modal
    dispatch(clearIncomingCall());
    if (onClose) onClose();
  };

  const isVideoCall = incomingCall?.call_type === 'video';

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width={400}
      className="incoming-call-modal"
      onCancel={handleReject}
      styles={{
        body: { 
          padding: '24px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px'
        }
      }}
    >
      <div style={{ color: 'white' }}>
        {/* Caller Avatar */}
        <Badge status="success" offset={[-10, 100]}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '4px solid white'
            }}
          />
        </Badge>

        {/* Caller Info */}
        <Title level={3} style={{ color: 'white', marginTop: 24, marginBottom: 8 }}>
          {incomingCall?.caller_name || 'Unknown Caller'}
        </Title>
        
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
          {isVideoCall ? 'Incoming Video Call' : 'Incoming Audio Call'}
        </Text>

        {/* Department Info */}
        {incomingCall?.caller_department_name && (
          <div style={{ marginTop: 12 }}>
            <Space>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                From: {incomingCall.caller_department_name}
              </span>
            </Space>
          </div>
        )}

        {/* Call Type Icon */}
        <div style={{ marginTop: 32 }}>
          {isVideoCall ? (
            <VideoCameraOutlined style={{ fontSize: 32, color: 'white' }} />
          ) : (
            <AudioOutlined style={{ fontSize: 32, color: 'white' }} />
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 24 }}>
          {/* Accept Button */}
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PhoneInPickedOutlined />}
            onClick={handleAccept}
            style={{
              width: 70,
              height: 70,
              background: '#52c41a',
              borderColor: '#52c41a',
              fontSize: 28,
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.4)'
            }}
          />
          
          {/* Reject Button */}
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PhoneOutlined />}
            onClick={handleReject}
            danger
            style={{
              width: 70,
              height: 70,
              fontSize: 28,
              boxShadow: '0 4px 12px rgba(255, 77, 79, 0.4)'
            }}
          />
        </div>

        {/* Button Labels */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 40 }}>
          <Text style={{ color: 'white' }}>Accept</Text>
          <Text style={{ color: 'white' }}>Decline</Text>
        </div>
      </div>

      {/* Hidden audio element for ringtone */}
      <audio ref={audioRef} loop style={{ display: 'none' }}>
        <source src="/notification.wav" type="audio/wav" />
      </audio>
    </Modal>
  );
};

export default IncomingCallModal;
