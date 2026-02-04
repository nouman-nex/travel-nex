const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorHandler.middleware");
const notFound = require("./middleware/notFound.middleware");
const { serverConfigs } = require("./config/vars");

// Route imports
const authRoutes = require("./routes/user/auth.route");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS
app.use(
  cors({
    origin: serverConfigs.CLIENT_URL,
    credentials: true,
  }),
);

// Compression
app.use(compression());

// Logging
if (serverConfigs.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
