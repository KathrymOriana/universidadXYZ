const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({
        success: false, message: 'Errores de validación',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg, value: e.value })),
    });
    next();
};

const validateCourse = [
    body('codigo').trim().notEmpty().withMessage('El código es obligatorio')
        .isLength({ min: 2, max: 10 }).withMessage('Entre 2 y 10 caracteres')
        .matches(/^[A-Z0-9]+$/).withMessage('Solo mayúsculas y números'),

    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 150 }).withMessage('Entre 3 y 150 caracteres'),

    body('creditos').notEmpty().withMessage('Los créditos son obligatorios')
        .isInt({ min: 1, max: 10 }).withMessage('Entre 1 y 10 créditos'),

    body('docente').trim().notEmpty().withMessage('El docente es obligatorio')
        .isLength({ min: 3, max: 100 }).withMessage('Entre 3 y 100 caracteres'),

    handleValidationErrors,
];

const validateId = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    handleValidationErrors,
];

module.exports = { validateCourse, validateId };