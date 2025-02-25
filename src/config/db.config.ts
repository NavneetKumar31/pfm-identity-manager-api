import mongoose from "mongoose";
import logger from "../utils/logger";

const MONGO_URI = process.env.MONGO_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("✅ MongoDB connected");
  } catch (error) {
    logger.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected");
});

export default connectDB;
