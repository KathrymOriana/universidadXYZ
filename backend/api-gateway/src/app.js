const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

const STUDENT_URL = process.env.STUDENT_SERVICE_URL || "http://localhost:3001";
const COURSE_URL = process.env.COURSE_SERVICE_URL || "http://localhost:3002";

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// ── Ruta raíz informativa ──────────────────────────────────────────────
app.get("/", (req, res) =>
    res.status(200).json({
        message: "🎓 Universidad Tecnológica XYZ — API Gateway",
        version: "1.0.0",
        endpoints: {
            students: "/api/v1/students",
            courses: "/api/v1/courses",
            health: "/health",
        },
    }),
);

// ── Health del propio gateway ──────────────────────────────────────────
app.get("/health", (req, res) =>
    res.status(200).json({
        service: process.env.SERVICE_NAME || "api-gateway",
        status: "UP",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        services: {
            "student-service": STUDENT_URL,
            "course-service": COURSE_URL,
        },
    }),
);

// ── Health proxies (para el frontend, evita CORS) ──────────────────────
app.get(
    "/health/students",
    createProxyMiddleware({
        target: STUDENT_URL,
        changeOrigin: true,
        pathRewrite: { "^/health/students": "/health" },
    }),
);

app.get(
    "/health/courses",
    createProxyMiddleware({
        target: COURSE_URL,
        changeOrigin: true,
        pathRewrite: { "^/health/courses": "/health" },
    }),
);

// ── Proxy → Student Service ────────────────────────────────────────────
// CLAVE: pathFilter en lugar de app.use('/ruta', proxy)
// Así Express NO elimina el prefijo antes de llegar al proxy
app.use(
    createProxyMiddleware({
        target: STUDENT_URL,
        changeOrigin: true,
        pathFilter: "/api/v1/students", // ← filtra SIN eliminar el path
        on: {
            proxyReq: (proxyReq, req) =>
                console.log(`[Gateway] → student-service: ${req.method} ${req.url}`),
            error: (err, req, res) => {
                console.error(`[Gateway] student-service error: ${err.message}`);
                res.status(503).json({
                    success: false,
                    message: "Student Service no disponible",
                    service: "student-service",
                });
            },
        },
    }),
);

// ── Proxy → Course Service ─────────────────────────────────────────────
app.use(
    createProxyMiddleware({
        target: COURSE_URL,
        changeOrigin: true,
        pathFilter: "/api/v1/courses", // ← filtra SIN eliminar el path
        on: {
            proxyReq: (proxyReq, req) =>
                console.log(`[Gateway] → course-service: ${req.method} ${req.url}`),
            error: (err, req, res) => {
                console.error(`[Gateway] course-service error: ${err.message}`);
                res.status(503).json({
                    success: false,
                    message: "Course Service no disponible",
                    service: "course-service",
                });
            },
        },
    }),
);

// ── 404 general ────────────────────────────────────────────────────────
app.use((req, res) =>
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada en Gateway: ${req.method} ${req.originalUrl}`,
    }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(
        `\n🌐 ${process.env.SERVICE_NAME || "api-gateway"} → http://localhost:${PORT}`,
    );
    console.log(`   /api/v1/students → ${STUDENT_URL}`);
    console.log(`   /api/v1/courses  → ${COURSE_URL}\n`);
});

module.exports = app;
