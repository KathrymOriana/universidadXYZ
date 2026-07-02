const CourseModel = require('../models/courseModel');

const courseController = {
    async getAll(req, res, next) {
        try {
            const courses = await CourseModel.findAll();
            res.status(200).json({ success: true, count: courses.length, data: courses });
        } catch (err) { next(err); }
    },

    async getById(req, res, next) {
        try {
            const course = await CourseModel.findById(parseInt(req.params.id));
            if (!course) return res.status(404).json({ success: false, message: `Curso con ID ${req.params.id} no encontrado` });
            res.status(200).json({ success: true, data: course });
        } catch (err) { next(err); }
    },

    async create(req, res, next) {
        try {
            const { codigo, nombre, creditos, docente } = req.body;
            if (await CourseModel.findByCodigo(codigo))
                return res.status(409).json({ success: false, message: `El código "${codigo}" ya está registrado` });

            const course = await CourseModel.create({ codigo, nombre, creditos: parseInt(creditos), docente });
            res.status(201).json({ success: true, message: 'Curso registrado exitosamente', data: course });
        } catch (err) { next(err); }
    },

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { codigo, nombre, creditos, docente } = req.body;

            if (!await CourseModel.findById(id))
                return res.status(404).json({ success: false, message: `Curso con ID ${id} no encontrado` });

            const byCodigo = await CourseModel.findByCodigo(codigo);
            if (byCodigo && byCodigo.id !== id)
                return res.status(409).json({ success: false, message: `El código "${codigo}" pertenece a otro curso` });

            const updated = await CourseModel.update(id, { codigo, nombre, creditos: parseInt(creditos), docente });
            res.status(200).json({ success: true, message: 'Curso actualizado exitosamente', data: updated });
        } catch (err) { next(err); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await CourseModel.deleteById(parseInt(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: `Curso con ID ${req.params.id} no encontrado` });
            res.status(200).json({ success: true, message: 'Curso eliminado exitosamente', data: deleted });
        } catch (err) { next(err); }
    },
};

module.exports = courseController;