// services/socketService.js

import io from 'socket.io-client';
import { WEBSOCKET_URL } from '../api/endpoints';

let socketInstance = null;

export const initializeSocket = (userData) => {
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

    socketInstance.emit('register', userData);
  }

  return socketInstance;
};

export const getSocket = () => socketInstance;