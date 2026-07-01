import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  "mongodb://localhost:27017/notify";
const MONGODB_DB = process.env.MONGODB_DB || "notify";

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export { connectDatabase };

