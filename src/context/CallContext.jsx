// contexts/CallContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getSocket } from '../service/socketService';
export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callStatus, setCallStatus] = useState(null);

  useEffect(() => {
    const socket = getSocket(); // Get the socket instance
    
    if (!socket) {
      console.warn('Socket not initialized yet');
      return;
    }

    const handleRejection = (data) => {
      setCallStatus('rejected');
      setShowCallDialog(false);
      console.log('Call was rejected:', data);
    };

    socket.on('department-call-rejected', handleRejection);

    return () => {
      socket.off('department-call-rejected', handleRejection);
    };
  }, []);

  return (
    <CallContext.Provider value={{ 
      incomingCall, 
      setIncomingCall, 
      showCallDialog, 
      setShowCallDialog,
      callStatus,
      setCallStatus
    }}>
      {children}
    </CallContext.Provider>
  );
};