import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});
