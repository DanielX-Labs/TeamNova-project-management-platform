import mongoose from "mongoose";
import { config } from "./app.config";
import { logger } from "../utils/logger";

mongoose.set("bufferCommands", false);

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongo database connection lost; waiting for driver recovery");
});

mongoose.connection.on("reconnected", () => {
  logger.info("Mongo database connection restored");
});

mongoose.connection.on("error", (error) => {
  console.error(`Mongo connection error: ${error.message}`);
});

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 15_000,
      connectTimeoutMS: 15_000,
      socketTimeoutMS: 45_000,
      heartbeatFrequencyMS: 10_000,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      retryReads: true,
      retryWrites: true,
    });
    logger.info("Connected to Mongo database");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error connecting to Mongo database: ${message}`);
    throw error;
  }
};

export default connectDatabase;
