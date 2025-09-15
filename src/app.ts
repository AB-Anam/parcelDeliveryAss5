import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import parcelRoutes from "./routes/parcel.routes";

// Middleware
import { errorHandler } from "./middlewares/error.middleware";

// Load environment variables
dotenv.config();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Health check
app.get("/", (_req, res) => {
  res.send("Parcel Delivery API Running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/parcels", parcelRoutes);

// Error handler
app.use(errorHandler);

export default app;
