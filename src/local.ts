import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./server"; // import the exported app

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Define root route if not already defined in server.ts
app.get("/", (req, res) => {
  res.send("API is running successfully! (Local)");
});

// Start the server locally
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`⚡ Server running locally on http://localhost:${PORT}`);
});
