// services/socketService.js

import io from 'socket.io-client';
import { WEBSOCKET_URL } from '../api/endpoints';

let socketInstance = null;
let pendingCallbacks = [];

// Call-related event handlers
const setupCallHandlers = (socket, callHandlers) => {
  socket.on('incoming-call', (data) => {
    callHandlers.onIncomingCall?.(data);
  });

  socket.on('incoming-department-call', (data) => {
    callHandlers.onIncomingDepartmentCall?.(data);
  });

  socket.on('call-accepted', (data) => {
    callHandlers.onCallAccepted?.(data);
  });

  socket.on('call-rejected', (data) => {
    callHandlers.onCallRejected?.(data);
  });

  socket.on('department-call-rejected', (data) => {
    callHandlers.onDepartmentCallRejected?.(data);
  });

  socket.on('signal', (data) => {
    callHandlers.onSignal?.(data);
  });

  socket.on('online-users-list', (data) => {
    callHandlers.onOnlineUsersUpdate?.(data);
  });

  socket.on('department-staff-list', (data) => {
    callHandlers.onDepartmentStaffUpdate?.(data);
  });
};

// Chat-related event handlers
const setupChatHandlers = (socket, chatHandlers) => {
  socket.on('new-message', (message) => {
    chatHandlers.onNewMessage?.(message);
  });

  socket.on('new-department-message', (message) => {
    chatHandlers.onNewDepartmentMessage?.(message);
  });

  socket.on('message-sent', (message) => {
    chatHandlers.onMessageSent?.(message);
  });
};

export const initializeSocket = (userData, handlers = {}) => {
  if (!socketInstance) {
    socketInstance = io(WEBSOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: userData.token
      }
    });

    // Setup handlers if provided
    if (handlers.callHandlers) {
      setupCallHandlers(socketInstance, handlers.callHandlers);
    }

    if (handlers.chatHandlers) {
      setupChatHandlers(socketInstance, handlers.chatHandlers);
    }

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      // Register user with complete data
      socketInstance.emit('register', userData);
      // handlePendingCallbacks();
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      handlers.onDisconnect?.(reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      handlers.onConnectError?.(error);
    });
  }

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const getSocket = () => socketInstance;

// Call-related functions
export const initiateCall = (callData) => {
  if (socketInstance) {
    socketInstance.emit('initiate-call', callData);
  }
};

export const initiateDepartmentCall = (callData) => {
  if (socketInstance) {
    socketInstance.emit('initiate-department-call', callData);
  }
};

export const acceptCall = (callData) => {
  if (socketInstance) {
    socketInstance.emit('accept-call', callData);
  }
};

export const rejectCall = (callData) => {
  if (socketInstance) {
    socketInstance.emit('reject-call', callData);
  }
};

export const answerDepartmentCall = (callData) => {
  if (socketInstance) {
    socketInstance.emit('answer-department-call', callData);
  }
};

export const rejectDepartmentCall = (callData) => {
  if (socketInstance) {
    socketInstance.emit('reject-department-call', callData);
  }
};

export const sendSignal = (signalData) => {
  if (socketInstance) {
    socketInstance.emit('signal', signalData);
  }
};

export const getOnlineUsers = () => {
  if (socketInstance) {
    socketInstance.emit('get-online-users');
  }
};

export const getDepartmentStaff = (departmentId) => {
  if (socketInstance) {
    socketInstance.emit('get-department-staff', { departmentId });
  }
};

// Chat-related functions
export const joinChatRooms = (rooms) => {
  if (socketInstance) {
    socketInstance.emit('join-chat-room', rooms);
  }
};

export const sendMessage = (messageData) => {
  if (socketInstance) {
    socketInstance.emit('send-message', messageData);
  }
};

export const markAsRead = (readData) => {
  if (socketInstance) {
    socketInstance.emit('mark-as-read', readData);
  }
};