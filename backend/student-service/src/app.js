const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
);
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) =>
    res.status(200).json({
        service: process.env.SERVICE_NAME || "student-service",
        status: "UP",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
    }),
);

app.use("/api/v1/students", studentRoutes);
// app.get("/", studentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(
            `\n🚀 ${process.env.SERVICE_NAME || "student-service"} → http://localhost:${PORT}`,
        );
        console.log(`📋 Ambiente: ${process.env.NODE_ENV || "development"}`);
        console.log(`🔗 API:      http://localhost:${PORT}/api/v1/students\n`);
    });
}

module.exports = app;