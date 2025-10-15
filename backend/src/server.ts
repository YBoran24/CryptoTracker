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

// Configure CORS with more flexible options
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://crypto-tracker-ashy-two.vercel.app',
      process.env.FRONTEND_URL // From environment variable
    ].filter(Boolean); // Remove any falsy values
    
    // Check if origin is in allowed list or if it's a Vercel preview URL
    if (allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true); // Temporarily allow all origins for debugging
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

const io = new socketIo.Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'CryptoTracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
// Use PORT environment variable provided by container platform, fallback to 5003
const PORT = parseInt(process.env.PORT || '5003', 10);

// Handle EADDRINUSE error gracefully
server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying with PORT+1...`);
    server.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT + 1}`);
      console.log(`API endpoints available at http://0.0.0.0:${PORT + 1}/api`);
    });
  } else {
    console.error(e);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
});

export default app;