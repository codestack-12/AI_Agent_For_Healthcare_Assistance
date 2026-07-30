import mongoose from "mongoose";

const connectDB = async () => {
  // Serverless functions can be invoked many times per minute; reuse an existing
  // connection instead of opening a new one on every request.
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("<username>")) {
    console.warn(
      "⚠️  MONGO_URI is not configured yet. Add your MongoDB Atlas connection string to backend/.env"
    );
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    throw err; // let the caller (server startup or request handler) decide how to respond
  }
};

export default connectDB;
