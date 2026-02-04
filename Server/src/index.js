require("dotenv").config();
require("express-async-errors");

const app = require("./app");
const connectDB = require("./db/database");
const { serverConfigs } = require("./config/vars");

const PORT = serverConfigs.PORT;

// Connect to database
connectDB();

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${serverConfigs.NODE_ENV} mode`,
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

module.exports = server;
