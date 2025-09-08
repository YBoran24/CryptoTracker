import { io, Socket } from 'socket.io-client';

// Initialize socket connection
let socket: Socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.BACKEND_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
    
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }
  
  return socket;
};

export const subscribeToPriceUpdates = (coinIds: string[], callback: (data: any) => void) => {
  const socket = initSocket();
  
  // Request price updates for specific coins
  socket.emit('requestPriceUpdates', { coinIds });
  
  // Listen for price updates
  socket.on('priceUpdate', callback);
  
  // Return unsubscribe function
  return () => {
    socket.off('priceUpdate', callback);
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};