import express, { Router } from 'express';
import authRoutes from './auth';
import coinsRoutes from './coins';
import userRoutes from './user';

const router: Router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'CryptoTracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Register all routes
router.use('/auth', authRoutes);
router.use('/coins', coinsRoutes);
router.use('/user', userRoutes);

export default router;