import { config } from "dotenv";
config({ path: __dirname + "/../.env" }); // Add this line

import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.config";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);

// Health check endpoint
app.get("/api/v1/auth/health", (req, res) => {
  res.status(200).json({
    app_name: process.env.APP_NAME,
    environment: ENV,
    status: "OK",
    timestamp: new Date(),
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
