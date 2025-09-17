import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

dotenv.config();

// Connect DB locally
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`⚡ Server running locally at http://localhost:${PORT}`);
});
