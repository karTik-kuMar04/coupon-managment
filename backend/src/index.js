import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import couponRoutes from './routes/couponRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/coupons', couponRoutes);

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    message: 'Coupon Management API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Coupon Management API',
    version: '1.0.0',
    endpoints: {
      'POST /coupons': 'Create a new coupon',
      'GET /coupons': 'List all coupons',
      'POST /coupons/best-coupon': 'Find the best applicable coupon'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

async function startServer() {
  try {
    const dbConnected = await connectDatabase();
    
    if (!dbConnected) {
      console.warn('Starting server without database connection...');
      console.warn('API will not work until MongoDB is connected');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoints:`);
      console.log(`   POST   http://localhost:${PORT}/coupons`);
      console.log(`   GET    http://localhost:${PORT}/coupons`);
      console.log(`   POST   http://localhost:${PORT}/coupons/best-coupon`);
      console.log(`CORS enabled for: ${CORS_ORIGIN}`);
      
      if (!dbConnected) {
        console.log('');
        console.log('MongoDB is not connected. Please start MongoDB and restart the server.');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  const { disconnectDatabase } = await import('./config/database.js');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  const { disconnectDatabase } = await import('./config/database.js');
  await disconnectDatabase();
  process.exit(0);
});

