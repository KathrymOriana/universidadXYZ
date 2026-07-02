# 🎓 Student Service - Puerto 3001

Microservicio REST para la gestión de estudiantes de la universidad.

## Endpoints

| Método | Ruta                    | Descripción          | Status    |
|--------|-------------------------|----------------------|-----------|
| GET    | `/api/v1/students`      | Listar todos         | 200       |
| GET    | `/api/v1/students/:id`  | Obtener por ID       | 200 / 404 |
| POST   | `/api/v1/students`      | Crear estudiante     | 201 / 400 |
| PUT    | `/api/v1/students/:id`  | Actualizar           | 200 / 404 |
| DELETE | `/api/v1/students/:id`  | Eliminar             | 200 / 404 |
| GET    | `/health`               | Estado del servicio  | 200       |

## Body requerido (POST / PUT)

```json
{
  "codigo":    "EST001",
  "nombres":   "Juan Carlos",
  "apellidos": "García López",
  "correo":    "juan@universidad.edu.pe",
  "carrera":   "Ingeniería de Sistemas"
}
```

## Ejecutar (desde la raíz del monorepo)

```bash
npm run dev:students   # Iniciar solo este servicio
npm run dev            # Iniciar todos los servicios
npm run test:students  # Tests
```

## Ejecutar (standalone - desde esta carpeta)

```bash
cd backend/student-service
npm install
npm test
npm run dev
```

## Variables de entorno

```dotenv
NODE_ENV=development
PORT=3001
SERVICE_NAME=student-service
DB_HOST=localhost
DB_PORT=5432
DB_NAME=universidad_db
DB_TEST_NAME=universidad_test_db
DB_USER=postgres
DB_PASSWORD=TuPassword
CORS_ORIGIN=*
```
