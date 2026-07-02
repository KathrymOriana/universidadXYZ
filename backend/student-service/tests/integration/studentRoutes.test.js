const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/config/database');

describe('Student Routes — Integration Tests', () => {
    let createdId;
    const PREFIX = 'ITEST';

    beforeAll(async () => {
        await pool.query(`DELETE FROM estudiantes WHERE codigo LIKE '${PREFIX}%'`);
    });

    afterAll(async () => {
        await pool.query(`DELETE FROM estudiantes WHERE codigo LIKE '${PREFIX}%'`);
        await pool.end();
    });

    const valid = {
        codigo: `${PREFIX}01`, nombres: 'Test User', apellidos: 'García Test',
        correo: 'test01@universidadxyz.edu.pe', carrera: 'Ingeniería de Sistemas',
    };

    it('GET /api/v1/students → 200 con array', async () => {
        const res = await request(app).get('/api/v1/students');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/students → 201 crea estudiante', async () => {
        const res = await request(app).post('/api/v1/students').send(valid);
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        createdId = res.body.data.id;
    });

    it('POST /api/v1/students → 409 código duplicado', async () => {
        const res = await request(app).post('/api/v1/students').send({ ...valid, correo: 'otro@test.com' });
        expect(res.status).toBe(409);
    });

    it('POST /api/v1/students → 400 datos inválidos', async () => {
        const res = await request(app).post('/api/v1/students').send({ codigo: '', nombres: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('GET /api/v1/students/:id → 200 encuentra por ID', async () => {
        const res = await request(app).get(`/api/v1/students/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdId);
    });

    it('GET /api/v1/students/999999 → 404', async () => {
        const res = await request(app).get('/api/v1/students/999999');
        expect(res.status).toBe(404);
    });

    it('PUT /api/v1/students/:id → 200 actualiza', async () => {
        const res = await request(app).put(`/api/v1/students/${createdId}`)
            .send({ ...valid, nombres: 'Test Actualizado', carrera: 'Ingeniería de Software' });
        expect(res.status).toBe(200);
        expect(res.body.data.nombres).toBe('Test Actualizado');
    });

    it('DELETE /api/v1/students/:id → 200 elimina', async () => {
        const res = await request(app).delete(`/api/v1/students/${createdId}`);
        expect(res.status).toBe(200);
    });

    it('GET /health → UP', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('UP');
    });
});