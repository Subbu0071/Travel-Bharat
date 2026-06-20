import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    console.log("MongoDB URI not provided. Using in-memory demo store.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Using in-memory demo store.");
    console.warn(error.message);
    return false;
  }
}
