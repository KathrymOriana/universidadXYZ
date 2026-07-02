const pool = require('../config/database');

const CourseModel = {
    async findAll() {
        const { rows } = await pool.query(
            'SELECT id,codigo,nombre,creditos,docente,created_at,updated_at FROM cursos ORDER BY id ASC'
        );
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(
            'SELECT id,codigo,nombre,creditos,docente,created_at,updated_at FROM cursos WHERE id=$1', [id]
        );
        return rows[0] || null;
    },

    async findByCodigo(codigo) {
        const { rows } = await pool.query('SELECT id,codigo FROM cursos WHERE codigo=$1', [codigo]);
        return rows[0] || null;
    },

    async create({ codigo, nombre, creditos, docente }) {
        const { rows } = await pool.query(
            `INSERT INTO cursos (codigo,nombre,creditos,docente)
       VALUES ($1,$2,$3,$4)
       RETURNING id,codigo,nombre,creditos,docente,created_at,updated_at`,
            [codigo, nombre, creditos, docente]
        );
        return rows[0];
    },

    async update(id, { codigo, nombre, creditos, docente }) {
        const { rows } = await pool.query(
            `UPDATE cursos SET codigo=$1,nombre=$2,creditos=$3,docente=$4
       WHERE id=$5
       RETURNING id,codigo,nombre,creditos,docente,created_at,updated_at`,
            [codigo, nombre, creditos, docente, id]
        );
        return rows[0] || null;
    },

    async deleteById(id) {
        const { rows } = await pool.query(
            'DELETE FROM cursos WHERE id=$1 RETURNING id,codigo,nombre,creditos,docente', [id]
        );
        return rows[0] || null;
    },
};

module.exports = CourseModel;