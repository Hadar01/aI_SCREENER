/**
 * ─── AI-Screener Pro — Express Server ───────────────────────────────────────────
 *
 * Entry point for the backend. Sets up middleware, routes, and starts
 * the HTTP server after establishing the MongoDB connection.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");

// ─── App Initialization ─────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ─── Rate Limiting ──────────────────────────────────────────────────────────────

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 uploads per hour
  message: {
    success: false,
    error: "Upload limit reached. Please try again later.",
  },
});

// ─── Body Parsing ───────────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Logging ────────────────────────────────────────────────────────────────────

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Static Files (uploaded resumes) ────────────────────────────────────────────

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ─── Routes ─────────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AI-Screener Pro API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Apply rate limiters
app.use("/api/upload", uploadLimiter);
app.use("/api", apiLimiter);

// Core API routes
app.use("/api", resumeRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ─── Global Error Handler ───────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
┌──────────────────────────────────────────────┐
│                                              │
│   🚀  AI-Screener Pro API                    │
│                                              │
│   Port:    ${String(PORT).padEnd(34)}│
│   Mode:    ${String(process.env.NODE_ENV || "development").padEnd(34)}│
│   AI:      ${String(process.env.AI_PROVIDER || "gemini").padEnd(34)}│
│                                              │
│   Endpoints:                                 │
│     POST   /api/upload                       │
│     GET    /api/candidates                   │
│     GET    /api/candidates/:id               │
│     DELETE /api/candidates/:id               │
│     POST   /api/candidates/:id/reanalyze     │
│     GET    /api/candidates/:id/download      │
│     GET    /api/stats                        │
│     GET    /api/export/csv                   │
│     GET    /api/health                       │
│                                              │
└──────────────────────────────────────────────┘
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // For testing
