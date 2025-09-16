import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Add this root route handler
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});


// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`⚡ Server running on port ${PORT}`);
// });

// ✅ Instead, export the app (Vercel will handle the server)
export default app;
