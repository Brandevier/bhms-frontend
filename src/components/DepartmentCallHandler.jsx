// components/DepartmentCallHandler.jsx
import { useContext, useEffect } from 'react';
import { initializeSocket } from '../service/socketService';
import { CallContext } from '../context/CallContext';

const DepartmentCallHandler = ({ userData }) => {
  const { setIncomingCall, setShowCallDialog } = useContext(CallContext);

  useEffect(() => {
    if (!userData) return;

    const socket = initializeSocket(userData);

    socket.on('incoming-department-call', (data) => {
      console.log('Incoming department call:', data);
      setIncomingCall(data);
      setShowCallDialog(true);
    });

    return () => {
      socket.off('incoming-department-call');
    };
  }, [userData, setIncomingCall, setShowCallDialog]);

  return null;
};

export default DepartmentCallHandler;