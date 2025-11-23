import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Prevent multiple connections in Vercel serverless
let isConnected = false;

export async function connectDatabase() {
  if (!MONGODB_URI) {
    console.error("Cannot connect: MONGODB_URI is not defined");
    return false;
  }

  // Use cached connection
  if (isConnected) {
    console.log("MongoDB already connected.");
    return true;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "couponDB",           // <-- force DB name
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected:", db.connection.host);
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    return false;
  }
}

export async function disconnectDatabase() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log("MongoDB disconnected.");
}
