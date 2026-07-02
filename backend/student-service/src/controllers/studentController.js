const StudentModel = require('../models/studentModel');

const studentController = {
    async getAll(req, res, next) {
        try {
            const students = await StudentModel.findAll();
            res.status(200).json({ success: true, count: students.length, data: students });
        } catch (err) { next(err); }
    },

    async getById(req, res, next) {
        try {
            const student = await StudentModel.findById(parseInt(req.params.id));
            if (!student) return res.status(404).json({ success: false, message: `Estudiante con ID ${req.params.id} no encontrado` });
            res.status(200).json({ success: true, data: student });
        } catch (err) { next(err); }
    },

    async create(req, res, next) {
        try {
            const { codigo, nombres, apellidos, correo, carrera } = req.body;

            if (await StudentModel.findByCodigo(codigo))
                return res.status(409).json({ success: false, message: `El código "${codigo}" ya está registrado` });

            if (await StudentModel.findByCorreo(correo))
                return res.status(409).json({ success: false, message: `El correo "${correo}" ya está registrado` });

            const student = await StudentModel.create({ codigo, nombres, apellidos, correo, carrera });
            res.status(201).json({ success: true, message: 'Estudiante registrado exitosamente', data: student });
        } catch (err) { next(err); }
    },

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { codigo, nombres, apellidos, correo, carrera } = req.body;

            const existing = await StudentModel.findById(id);
            if (!existing) return res.status(404).json({ success: false, message: `Estudiante con ID ${id} no encontrado` });

            const byCodigo = await StudentModel.findByCodigo(codigo);
            if (byCodigo && byCodigo.id !== id)
                return res.status(409).json({ success: false, message: `El código "${codigo}" pertenece a otro estudiante` });

            const byCorreo = await StudentModel.findByCorreo(correo);
            if (byCorreo && byCorreo.id !== id)
                return res.status(409).json({ success: false, message: `El correo "${correo}" pertenece a otro estudiante` });

            const updated = await StudentModel.update(id, { codigo, nombres, apellidos, correo, carrera });
            res.status(200).json({ success: true, message: 'Estudiante actualizado exitosamente', data: updated });
        } catch (err) { next(err); }
    },

    async delete(req, res, next) {
        try {
            const deleted = await StudentModel.deleteById(parseInt(req.params.id));
            if (!deleted) return res.status(404).json({ success: false, message: `Estudiante con ID ${req.params.id} no encontrado` });
            res.status(200).json({ success: true, message: 'Estudiante eliminado exitosamente', data: deleted });
        } catch (err) { next(err); }
    },
};

module.exports = studentController;