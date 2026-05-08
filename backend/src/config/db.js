const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting MongoDB connection...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds hard fail
    });

    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("MongoDB connection FAILED:");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;