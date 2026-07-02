const studentController = require('../../src/controllers/studentController');
const StudentModel = require('../../src/models/studentModel');

jest.mock('../../src/models/studentModel');

describe('StudentController — Unit Tests', () => {
    let mockReq, mockRes, mockNext;

    const sample = {
        id: 1, codigo: 'EST001', nombres: 'Juan', apellidos: 'García',
        correo: 'juan@universidadxyz.edu.pe', carrera: 'Ingeniería de Sistemas',
    };

    beforeEach(() => {
        mockReq = { params: {}, body: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('getAll()', () => {
        it('retorna 200 con lista de estudiantes', async () => {
            StudentModel.findAll.mockResolvedValue([sample]);
            await studentController.getAll(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, count: 1, data: [sample] });
        });
        it('llama next() si hay error', async () => {
            StudentModel.findAll.mockRejectedValue(new Error('DB error'));
            await studentController.getAll(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('getById()', () => {
        it('retorna 200 si existe', async () => {
            mockReq.params.id = '1';
            StudentModel.findById.mockResolvedValue(sample);
            await studentController.getById(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it('retorna 404 si no existe', async () => {
            mockReq.params.id = '999';
            StudentModel.findById.mockResolvedValue(null);
            await studentController.getById(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('create()', () => {
        it('retorna 201 al crear', async () => {
            mockReq.body = { ...sample };
            StudentModel.findByCodigo.mockResolvedValue(null);
            StudentModel.findByCorreo.mockResolvedValue(null);
            StudentModel.create.mockResolvedValue({ id: 1, ...sample });
            await studentController.create(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });
        it('retorna 409 si código duplicado', async () => {
            mockReq.body = { ...sample };
            StudentModel.findByCodigo.mockResolvedValue(sample);
            await studentController.create(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(409);
        });
    });

    describe('update()', () => {
        it('retorna 200 al actualizar', async () => {
            mockReq.params.id = '1'; mockReq.body = { ...sample };
            StudentModel.findById.mockResolvedValue(sample);
            StudentModel.findByCodigo.mockResolvedValue({ id: 1, codigo: 'EST001' });
            StudentModel.findByCorreo.mockResolvedValue({ id: 1, correo: 'juan@universidadxyz.edu.pe' });
            StudentModel.update.mockResolvedValue(sample);
            await studentController.update(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it('retorna 404 si no existe', async () => {
            mockReq.params.id = '999'; mockReq.body = sample;
            StudentModel.findById.mockResolvedValue(null);
            await studentController.update(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('delete()', () => {
        it('retorna 200 al eliminar', async () => {
            mockReq.params.id = '1';
            StudentModel.deleteById.mockResolvedValue(sample);
            await studentController.delete(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
        it('retorna 404 si no existe', async () => {
            mockReq.params.id = '999';
            StudentModel.deleteById.mockResolvedValue(null);
            await studentController.delete(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });
});