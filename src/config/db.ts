import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}
