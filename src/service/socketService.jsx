// services/socketService.js
import io from 'socket.io-client';
import { WEBSOCKET_URL } from '../api/endpoints';

let socketInstance = null;

// =========================
// 🔹 SETUP HANDLER GROUPS
// =========================

// Call-related handlers
const setupCallHandlers = (socket, callHandlers) => {
  socket.on('incoming-call', (data) => callHandlers.onIncomingCall?.(data));
  socket.on('incoming-department-call', (data) => callHandlers.onIncomingDepartmentCall?.(data));
  socket.on('call-accepted', (data) => callHandlers.onCallAccepted?.(data));
  socket.on('call-rejected', (data) => callHandlers.onCallRejected?.(data));
  socket.on('department-call-rejected', (data) => callHandlers.onDepartmentCallRejected?.(data));
  socket.on('signal', (data) => callHandlers.onSignal?.(data));
  socket.on('online-users-list', (data) => callHandlers.onOnlineUsersUpdate?.(data));
  socket.on('department-staff-list', (data) => callHandlers.onDepartmentStaffUpdate?.(data));
};

// Chat-related handlers
const setupChatHandlers = (socket, chatHandlers) => {
  socket.on('new-message', (message) => chatHandlers.onNewMessage?.(message));
  socket.on('new-department-message', (message) => chatHandlers.onNewDepartmentMessage?.(message));
  socket.on('message-sent', (message) => chatHandlers.onMessageSent?.(message));
};

// 🔔 Notification-related handlers
const setupNotificationHandlers = (socket, notificationHandlers) => {
  socket.on('new-notification', (notification) => {
    notificationHandlers.onNewNotification?.(notification);
  });

  socket.on('notification-read', (data) => {
    notificationHandlers.onNotificationRead?.(data);
  });

  socket.on('notification-deleted', (data) => {
    notificationHandlers.onNotificationDeleted?.(data);
  });
};

// =========================
// 🔹 INITIALIZE SOCKET
// =========================
export const initializeSocket = (userData, handlers = {}) => {
  if (!socketInstance) {
    socketInstance = io(WEBSOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: { token: userData.token },
    });

    // Attach handlers
    if (handlers.callHandlers) setupCallHandlers(socketInstance, handlers.callHandlers);
    if (handlers.chatHandlers) setupChatHandlers(socketInstance, handlers.chatHandlers);
    if (handlers.notificationHandlers) setupNotificationHandlers(socketInstance, handlers.notificationHandlers);

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      socketInstance.emit('register', userData);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('⚠️ Socket disconnected:', reason);
      handlers.onDisconnect?.(reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
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

// =========================
// 🔹 CALL FUNCTIONS
// =========================
export const initiateCall = (data) => socketInstance?.emit('initiate-call', data);
export const initiateDepartmentCall = (data) => socketInstance?.emit('initiate-department-call', data);
export const acceptCall = (data) => socketInstance?.emit('accept-call', data);
export const rejectCall = (data) => socketInstance?.emit('reject-call', data);
export const answerDepartmentCall = (data) => socketInstance?.emit('answer-department-call', data);
export const rejectDepartmentCall = (data) => socketInstance?.emit('reject-department-call', data);
export const sendSignal = (data) => socketInstance?.emit('signal', data);
export const getOnlineUsers = () => socketInstance?.emit('get-online-users');
export const getDepartmentStaff = (departmentId) => socketInstance?.emit('get-department-staff', { departmentId });

// =========================
// 🔹 CHAT FUNCTIONS
// =========================
export const joinChatRooms = (rooms) => socketInstance?.emit('join-chat-room', rooms);
export const sendMessage = (data) => socketInstance?.emit('send-message', data);
export const markAsRead = (data) => socketInstance?.emit('mark-as-read', data);

// =========================
// 🔹 NOTIFICATION FUNCTIONS
// =========================
export const sendNotification = (notificationData) => {
  socketInstance?.emit('send-notification', notificationData);
};

export const markNotificationAsRead = (notificationId) => {
  socketInstance?.emit('mark-notification-read', { notificationId });
};

export const deleteNotification = (notificationId) => {
  socketInstance?.emit('delete-notification', { notificationId });
};
