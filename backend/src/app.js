const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

// ── Cheryl's routes ──
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;