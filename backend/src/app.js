const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes   = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");

const userRoutes   = require("./routes/userRoutes");
const errorHandler = require("./middleware/error.middleware");

app.use("/api/auth",   authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users",  userRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;