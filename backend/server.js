import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "https://ved-bice.vercel.app", credentials: true }));
app.use(express.json());

// On Vercel each request may hit a fresh (cold-started) function instance, so make sure
// the DB is connected before handling the request. connectDB() reuses an existing
// connection when one is already open, so this is a cheap no-op on warm invocations.
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "VedaCare API" }));
app.get("/api/test", (_req, res) => {
  res.json({ message: "Server updated successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);

// Placeholder routers for the rest of the spec — wire these up as those features are built.
// app.use("/api/hospitals", hospitalRoutes);
// app.use("/api/medicine", medicineRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Vercel imports this file as a serverless function and uses the default export directly —
// it never runs the code below. Locally (and on platforms like Render), start a real server.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 VedaCare API running on port ${PORT}`));
}

export default app;
