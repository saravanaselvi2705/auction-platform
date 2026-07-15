import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/* ============================================
   CORS Configuration
============================================ */

const allowedOrigins = [
  "http://localhost:5173",
  "https://auction-platform-silk.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ============================================
   Middlewares
============================================ */

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* ============================================
   Routes
============================================ */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* ============================================
   Health Check
============================================ */

app.get("/", (req, res) => {
  res.send("🚀 Auction Platform Backend Running...");
});

/* ============================================
   404 Handler
============================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* ============================================
   Global Error Handler
============================================ */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ============================================
   Start Server
============================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});