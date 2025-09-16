import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

dotenv.config();

// Connect to MongoDB
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// ❌ Do NOT use app.listen on Vercel
export default app;
