const mongoose = require("mongoose");
const { serverConfigs } = require("../config/vars");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(serverConfigs.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
