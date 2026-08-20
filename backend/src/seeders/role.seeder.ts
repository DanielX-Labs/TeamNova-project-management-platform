import "dotenv/config";
import connectDatabase from "../config/database.config";
import mongoose from "mongoose";
import { ensureRoles } from "../services/role.service";
import { logger } from "../utils/logger";

const seedRoles = async () => {
  logger.info("Seeding roles started...");

  try {
    await connectDatabase();

    await ensureRoles();
    logger.info("Seeding completed successfully.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error during seeding: ${message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void seedRoles();
