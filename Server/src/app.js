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
const bankAccountRoutes = require("./routes/admin/bankAccount.route");
const mailRoutes = require("./routes/user/mail.route");
const partnerRoute = require("./routes/admin/partner.route");
const dashboardRoute = require("./routes/admin/dashboard.route");
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
    origin: [serverConfigs.CLIENT_URL, "http://localhost:5173"],
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
app.use("/api/v2/bankAccounts", bankAccountRoutes);
app.use("/api/v3/mail", mailRoutes);
app.use("/api/v4/partners", partnerRoute);
app.use("/api/v5/dashboard", dashboardRoute);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
