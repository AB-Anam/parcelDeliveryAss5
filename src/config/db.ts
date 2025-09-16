import mongoose from "mongoose";

declare global {
  var mongooseConnection: any;
}

const connectDB = async () => {
  if (global.mongooseConnection) {
    return global.mongooseConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB connected");
    global.mongooseConnection = conn;
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;
