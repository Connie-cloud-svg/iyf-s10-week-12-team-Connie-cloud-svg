const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast if DB is unreachable
      autoIndex: true
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;