import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  console.error('Please add MONGODB_URI to your .env file');
}

export async function connectDatabase() {
  if (!MONGODB_URI) {
    console.error('Cannot connect: MONGODB_URI is not defined');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB Atlas successfully');
    console.log(`Database: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error.message);
    console.error('Make sure:');
    console.error('   1. Your IP address is whitelisted in MongoDB Atlas');
    console.error('   2. Your network allows connections to MongoDB Atlas');
    console.error('   3. The connection string in .env is correct');
    return false;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
}
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

