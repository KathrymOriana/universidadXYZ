const pool = require('../config/database');

const StudentModel = {
    async findAll() {
        const { rows } = await pool.query(
        'SELECT id,codigo,nombres,apellidos,correo,carrera,created_at,updated_at FROM estudiantes ORDER BY id ASC'
        );
        return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
        'SELECT id,codigo,nombres,apellidos,correo,carrera,created_at,updated_at FROM estudiantes WHERE id=$1',
        [id]
    );
    return rows[0] || null;
  },

  async findByCodigo(codigo) {
    const { rows } = await pool.query(
      'SELECT id,codigo FROM estudiantes WHERE codigo=$1', [codigo]
    );
    return rows[0] || null;
  },

  async findByCorreo(correo) {
    const { rows } = await pool.query(
      'SELECT id,correo FROM estudiantes WHERE correo=$1', [correo]
    );
    return rows[0] || null;
  },

  async create({ codigo, nombres, apellidos, correo, carrera }) {
    const { rows } = await pool.query(
      `INSERT INTO estudiantes (codigo,nombres,apellidos,correo,carrera)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id,codigo,nombres,apellidos,correo,carrera,created_at,updated_at`,
      [codigo, nombres, apellidos, correo, carrera]
    );
    return rows[0];
  },

  async update(id, { codigo, nombres, apellidos, correo, carrera }) {
    const { rows } = await pool.query(
      `UPDATE estudiantes
       SET codigo=$1,nombres=$2,apellidos=$3,correo=$4,carrera=$5
       WHERE id=$6
       RETURNING id,codigo,nombres,apellidos,correo,carrera,created_at,updated_at`,
      [codigo, nombres, apellidos, correo, carrera, id]
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM estudiantes WHERE id=$1 RETURNING id,codigo,nombres,apellidos,correo,carrera',
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = StudentModel;