import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import couponRoutes from './routes/couponRoutes.js';

dotenv.config();

const app = express();
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

// Connect to DB one time
connectDatabase();


export default app;
