import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Add this root route handler
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});