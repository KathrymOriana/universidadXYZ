const errorHandler = (err, req, res, next) => {
    console.error(`✖ [${new Date().toISOString()}] ${err.stack || err.message}`);

    if (err.code === '23505') return res.status(409).json({ success: false, message: 'Registro duplicado', detail: err.detail });
    if (err.code === '23502') return res.status(400).json({ success: false, message: 'Campo requerido nulo', detail: err.detail });
    if (err.code === '23514') return res.status(400).json({ success: false, message: 'Valor fuera de rango', detail: err.detail });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;