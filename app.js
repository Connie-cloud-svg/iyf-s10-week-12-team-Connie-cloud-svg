const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Routes
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running successfully"
    });
});

app.use("/api/auth", authRoutes);
app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});
app.use(errorHandler);

module.exports = app;
