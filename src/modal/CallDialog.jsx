// components/CallDialog.jsx
import { Modal, Button } from 'antd';
import { useContext, useEffect,useState } from 'react';
import { CallContext } from '../context/CallContext';



const CallDialog = () => {
  const { incomingCall, showCallDialog, setShowCallDialog } = useContext(CallContext);
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
    // Add your accept call logic here
    setShowCallDialog(false);
  };

  const handleReject = () => {
    // Add your reject call logic here
    setShowCallDialog(false);
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