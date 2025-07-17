// components/CallDialog.jsx
import { Modal, Button } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { CallContext } from '../context/CallContext';
import { getSocket } from '../service/socketService';
const CallDialog = () => {
  const { incomingCall, showCallDialog, setShowCallDialog, setIncomingCall } = useContext(CallContext);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer;
    if (showCallDialog) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showCallDialog]);

  const handleAccept = () => {
    const socket = getSocket(); // Get the socket instance
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }
    
    socket.emit('answer-department-call', { 
      callId: incomingCall.callId,
      answererId: incomingCall.answererId
    });
    setShowCallDialog(false);
    setIncomingCall(null);
  };

  const handleReject = () => {
    const socket = getSocket(); // Get the socket instance
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }
    
    socket.emit('reject-department-call', { 
      callId: incomingCall.callId,
      reason: 'User rejected the call'
    });
    setShowCallDialog(false);
    setIncomingCall(null);
  };

  if (!showCallDialog || !incomingCall) return null;

  return (
    <Modal
      title="Incoming Department Call"
      visible={showCallDialog}
      onCancel={handleReject}
      footer={[
        <Button 
          key="reject" 
          type="primary" 
          danger
          onClick={handleReject}
          style={{ minWidth: '120px' }}
        >
          Reject
        </Button>,
        <Button 
          key="accept" 
          type="primary"
          onClick={handleAccept}
          style={{ minWidth: '120px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
        >
          Accept
        </Button>
      ]}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>{incomingCall.callerName} is calling</h3>
        <p>Department: {incomingCall.departmentId}</p>
        <p>Call duration: {callDuration}s</p>
      </div>
    </Modal>
  );
};

export default CallDialog;