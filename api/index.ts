import app from "../src/app";
import connectDB from "../src/config/db";
import dotenv from "dotenv";

dotenv.config();

// Ensure DB is connected in serverless
connectDB();

export default app;
