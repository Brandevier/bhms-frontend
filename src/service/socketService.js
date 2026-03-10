import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { setIncomingCall, setCallStatus, setCurrentCall } from '../redux/slice/callSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.currentUserId = null;
    this.currentDepartmentId = null;
    this.chatHandlers = null;
  }

  // Support both initializeSocket(url, handlers) and initializeSocket(userData, handlers)
  initialize(socketUrlOrUserData, handlers = {}) {
    if (this.socket) {
      this.socket.disconnect();
    }

    // Determine if first param is URL (string) or user data (object)
    let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    let userData = null;
    
    if (typeof socketUrlOrUserData === 'string') {
      // First param is URL
      url = socketUrlOrUserData || url;
    } else if (socketUrlOrUserData && typeof socketUrlOrUserData === 'object') {
      // First param is user data object (contains token, userId, etc.)
      userData = socketUrlOrUserData;
    }
    
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Store handlers
    this.chatHandlers = handlers.chatHandlers || null;

    // If user data was provided, store it for registration after connection
    if (userData) {
      this.currentUserId = userData.userId;
    }

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      if (this.currentUserId && this.currentDepartmentId) {
        this.register(this.currentUserId, this.currentDepartmentId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Call events
    this.socket.on('incoming-call', (data) => {
      console.log('Incoming call received:', data);
      store.dispatch(setIncomingCall(data));
    });

    this.socket.on('call-accepted', (data) => {
      console.log('Call accepted:', data);
      store.dispatch(setCurrentCall(data.call));
      store.dispatch(setCallStatus('connected'));
    });

    this.socket.on('call-rejected', (data) => {
      console.log('Call rejected:', data);
      store.dispatch(setCallStatus('ended'));
    });

    this.socket.on('call-ended', (data) => {
      console.log('Call ended:', data);
      store.dispatch(setCallStatus('ended'));
      store.dispatch(setCurrentCall(null));
    });

    this.socket.on('call-error', (data) => {
      console.error('Call error:', data);
      store.dispatch(setCallStatus('failed'));
    });

    // WebRTC signaling
    this.socket.on('webrtc-signal', (data) => {
      console.log('WebRTC signal received:', data);
      // This event should be handled by the video call component
      window.dispatchEvent(new CustomEvent('webrtc-signal', { detail: data }));
    });

    this.socket.on('user-joined', (data) => {
      console.log('User joined call:', data);
      window.dispatchEvent(new CustomEvent('user-joined', { detail: data }));
    });

    this.socket.on('user-left', (data) => {
      console.log('User left call:', data);
      window.dispatchEvent(new CustomEvent('user-left', { detail: data }));
    });

    // Chat message events
    this.socket.on('new-message', (message) => {
      console.log('New message received:', message);
      if (this.chatHandlers?.onNewMessage) {
        this.chatHandlers.onNewMessage(message);
      }
    });

    this.socket.on('new-department-message', (message) => {
      console.log('New department message received:', message);
      if (this.chatHandlers?.onNewDepartmentMessage) {
        this.chatHandlers.onNewDepartmentMessage(message);
      }
    });

    // Department message notification for toast
    this.socket.on('department-message-notification', (notification) => {
      console.log('Department message notification received:', notification);
      if (this.chatHandlers?.onDepartmentMessageNotification) {
        this.chatHandlers.onDepartmentMessageNotification(notification);
      }
    });

    this.socket.on('message-sent', (message) => {
      console.log('Message sent confirmation:', message);
      if (this.chatHandlers?.onMessageSent) {
        this.chatHandlers.onMessageSent(message);
      }
    });

    this.socket.on('message-error', (error) => {
      console.error('Message error:', error);
      if (this.chatHandlers?.onMessageError) {
        this.chatHandlers.onMessageError(error);
      }
    });
  }

  register(userId, departmentId) {
    this.currentUserId = userId;
    this.currentDepartmentId = departmentId;
    
    if (this.socket && this.socket.connected) {
      this.socket.emit('register', { userId, departmentId });
      console.log('Registered for calls:', { userId, departmentId });
    }
  }

  // Department call methods
  initiateDepartmentCall(targetDepartmentId, callData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('initiate-department-call', {
        targetDepartmentId,
        ...callData
      });
      console.log('Initiating department call:', targetDepartmentId);
    }
  }

  acceptCall(callId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('accept-call', { callId });
      console.log('Accepting call:', callId);
    }
  }

  rejectCall(callId, reason = 'Declined') {
    if (this.socket && this.socket.connected) {
      this.socket.emit('reject-call', { callId, reason });
      console.log('Rejecting call:', callId);
    }
  }

  endCall(callId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('end-call', { callId });
      console.log('Ending call:', callId);
    }
  }

  // WebRTC signaling
  sendWebRTCSignal(callId, signal) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('webrtc-signal', { callId, signal });
    }
  }

  // Join/leave call room
  joinCallRoom(roomName) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join-call-room', { roomName });
    }
  }

  leaveCallRoom(roomName) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave-call-room', { roomName });
    }
  }

  // Get online departments/staff
  getOnlineStaff(departmentId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('get-online-staff', { departmentId });
    }
  }

  // Listen for online staff response
  onOnlineStaff(callback) {
    if (this.socket) {
      this.socket.on('online-staff', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

export const socketService = new SocketService();
export const getSocket = () => socketService.socket;

// Wrapper functions to match expected imports
export const initializeSocket = (socketUrl) => socketService.initialize(socketUrl);
export const disconnectSocket = () => socketService.disconnect();

export default socketService;
