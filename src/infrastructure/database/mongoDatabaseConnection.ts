import mongoose from "mongoose";
import { IDatabaseConnection } from "./IDatabaseConnection";
import { env } from "../../config/env";


export class MongoDatabaseConnection implements IDatabaseConnection {
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(env.mongoUri);
      console.log("MongoDB connected successfully");
    } catch (error: unknown) {
      console.error("MongoDB connection failed", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  }
}