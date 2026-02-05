exports.serverConfigs = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/travel-agency",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5174",
  // Add more configs as needed
};
