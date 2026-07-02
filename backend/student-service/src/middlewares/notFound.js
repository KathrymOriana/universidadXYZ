const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
        service: process.env.SERVICE_NAME || 'student-service',
    });
};

module.exports = notFound;