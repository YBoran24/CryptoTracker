import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: express.Application = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', routes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Listen for price update requests
  socket.on('requestPriceUpdates', (data) => {
    console.log('Client requested price updates for:', data);
    // In a real implementation, you would start sending real-time updates here
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5003; // Portu 5003 olarak değiştirdik
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

export default app;