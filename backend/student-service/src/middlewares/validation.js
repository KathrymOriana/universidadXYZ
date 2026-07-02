const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg, value: e.value })),
        });
    }
    next();
};

const validateStudent = [
    body('codigo')
        .trim().notEmpty().withMessage('El código es obligatorio')
        .isLength({ min: 2, max: 10 }).withMessage('El código debe tener entre 2 y 10 caracteres')
        .matches(/^[A-Z0-9]+$/).withMessage('Solo mayúsculas y números'),

    body('nombres')
        .trim().notEmpty().withMessage('Los nombres son obligatorios')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Solo letras y espacios'),

    body('apellidos')
        .trim().notEmpty().withMessage('Los apellidos son obligatorios')
        .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Solo letras y espacios'),

    body('correo')
        .trim().notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Formato de correo inválido')
        .isLength({ max: 150 }).withMessage('Máximo 150 caracteres')
        .normalizeEmail(),

    body('carrera')
        .trim().notEmpty().withMessage('La carrera es obligatoria')
        .isLength({ min: 3, max: 100 }).withMessage('Entre 3 y 100 caracteres'),

    handleValidationErrors,
];

const validateId = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo'),
    handleValidationErrors,
];

module.exports = { validateStudent, validateId };