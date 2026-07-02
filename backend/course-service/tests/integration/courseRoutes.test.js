const request = require("supertest");
const app = require("../../src/app");
const pool = require("../../src/config/database");

describe("Course Routes — Integration Tests", () => {
    let createdId;
    const PREFIX = "ITEST";

    beforeAll(async () => {
        await pool.query(`DELETE FROM cursos WHERE codigo LIKE '${PREFIX}%'`);
    });
    afterAll(async () => {
        await pool.query(`DELETE FROM cursos WHERE codigo LIKE '${PREFIX}%'`);
        await pool.end();
    });

    const valid = {
        codigo: `${PREFIX}C1`,
        nombre: "Curso de Integración",
        creditos: 4,
        docente: "Dr. Test",
    };

    it("GET /api/v1/courses → 200", async () => {
        const res = await request(app).get("/api/v1/courses");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("POST /api/v1/courses → 201 crea curso", async () => {
        const res = await request(app).post("/api/v1/courses").send(valid);
        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty("id");
        createdId = res.body.data.id;
    });

    it("POST /api/v1/courses → 400 créditos fuera de rango", async () => {
        const res = await request(app)
            .post("/api/v1/courses")
            .send({ ...valid, creditos: 15, codigo: `${PREFIX}C2` });
        expect(res.status).toBe(400);
    });

    it("POST /api/v1/courses → 409 código duplicado", async () => {
        const res = await request(app).post("/api/v1/courses").send(valid);
        expect(res.status).toBe(409);
    });

    it("GET /api/v1/courses/:id → 200", async () => {
        const res = await request(app).get(`/api/v1/courses/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(createdId);
    });

    it("GET /api/v1/courses/999999 → 404", async () => {
        const res = await request(app).get("/api/v1/courses/999999");
        expect(res.status).toBe(404);
    });

    it("PUT /api/v1/courses/:id → 200 actualiza", async () => {
        const res = await request(app)
            .put(`/api/v1/courses/${createdId}`)
            .send({ ...valid, nombre: "Curso Actualizado", creditos: 5 });
        expect(res.status).toBe(200);
        expect(res.body.data.nombre).toBe("Curso Actualizado");
    });

    it("DELETE /api/v1/courses/:id → 200 elimina", async () => {
        const res = await request(app).delete(`/api/v1/courses/${createdId}`);
        expect(res.status).toBe(200);
    });

    it("GET /health → UP", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("UP");
    });
});
