const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const errorHandler = require("./middleware/error.middleware");

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;