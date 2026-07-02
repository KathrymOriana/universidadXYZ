const courseController = require("../../src/controllers/courseController");
const CourseModel = require("../../src/models/courseModel");

jest.mock("../../src/models/courseModel");

describe("CourseController — Unit Tests", () => {
    let mockReq, mockRes, mockNext;
    const sample = {
        id: 1,
        codigo: "CUR001",
        nombre: "POO",
        creditos: 4,
        docente: "Dr. Alexander Test",
    };

    beforeEach(() => {
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe("getAll()", () => {
        it("retorna 200 con cursos", async () => {
            CourseModel.findAll.mockResolvedValue([sample]);
            await courseController.getAll(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it("llama next() en error", async () => {
            CourseModel.findAll.mockRejectedValue(new Error("DB error"));
            await courseController.getAll(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe("getById()", () => {
        it("retorna 200 si existe", async () => {
            mockReq.params.id = "1";
            CourseModel.findById.mockResolvedValue(sample);
            await courseController.getById(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it("retorna 404 si no existe", async () => {
            mockReq.params.id = "999";
            CourseModel.findById.mockResolvedValue(null);
            await courseController.getById(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe("create()", () => {
        it("retorna 201 al crear", async () => {
            mockReq.body = sample;
            CourseModel.findByCodigo.mockResolvedValue(null);
            CourseModel.create.mockResolvedValue({ id: 1, ...sample });
            await courseController.create(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });
        it("retorna 409 si código duplicado", async () => {
            mockReq.body = sample;
            CourseModel.findByCodigo.mockResolvedValue(sample);
            await courseController.create(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(409);
        });
    });

    describe("update()", () => {
        it("retorna 200 al actualizar", async () => {
            mockReq.params.id = "1";
            mockReq.body = sample;
            CourseModel.findById.mockResolvedValue(sample);
            CourseModel.findByCodigo.mockResolvedValue({ id: 1, codigo: "CUR001" });
            CourseModel.update.mockResolvedValue(sample);
            await courseController.update(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it("retorna 404 si no existe", async () => {
            mockReq.params.id = "999";
            mockReq.body = sample;
            CourseModel.findById.mockResolvedValue(null);
            await courseController.update(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe("delete()", () => {
        it("retorna 200 al eliminar", async () => {
            mockReq.params.id = "1";
            CourseModel.deleteById.mockResolvedValue(sample);
            await courseController.delete(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it("retorna 404 si no existe", async () => {
            mockReq.params.id = "999";
            CourseModel.deleteById.mockResolvedValue(null);
            await courseController.delete(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});
