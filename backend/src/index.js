import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database.js';
import couponRoutes from './routes/couponRoutes.js';

dotenv.config();

const app = express();

const getCorsOrigin = () => {
  if (process.env.VERCEL) {
    return process.env.CORS_ORIGIN || '*';
  }
  return process.env.CORS_ORIGIN || 'http://localhost:5173';
};

const corsOptions = {
  origin: getCorsOrigin(),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle /api prefix from Vercel routing
// When Vercel routes /api/* to this file, we need to strip the /api prefix
// or mount routes under /api. We'll do both for flexibility.
app.use((req, res, next) => {
  // If the path starts with /api, remove it for internal routing
  if (req.path.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
    req.path = req.path.replace(/^\/api/, '') || '/';
  }
  next();
});

// Mount routes - these will work with or without /api prefix
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

// Connect to database - this will be called on each serverless invocation
// In serverless, connections are reused across invocations when possible
if (process.env.VERCEL) {
  // On Vercel, connect to DB but don't start a server
  connectDatabase().catch(err => {
    console.error('Database connection error on Vercel:', err);
  });
} else {
  // Local development: start Express server
  const PORT = process.env.PORT || 3000;
  connectDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

// Export the Express app for Vercel serverless functions
// Vercel's @vercel/node builder will automatically wrap this as a handler
export default app;
