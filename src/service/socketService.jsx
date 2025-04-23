// services/socketService.js
import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (userData) => {
  if (!socket) {
    socket = io('http://localhost:7000', {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: userData.token // Include auth token if needed
      }
    });    

    socket.emit('register', userData);

    return socket;
  }
  
  return socket;
};
