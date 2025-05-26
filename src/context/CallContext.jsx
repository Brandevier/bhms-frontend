// contexts/CallContext.jsx
import { createContext, useState } from 'react';

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [showCallDialog, setShowCallDialog] = useState(false);

  return (
    <CallContext.Provider value={{ incomingCall, setIncomingCall, showCallDialog, setShowCallDialog }}>
      {children}
    </CallContext.Provider>
  );
};