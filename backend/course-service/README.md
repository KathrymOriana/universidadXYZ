# 📚 Course Service - Puerto 3002

Microservicio REST para la gestión de cursos de la universidad.

## Endpoints

| Método | Ruta                   | Descripción      | Status    |
|--------|------------------------|------------------|-----------|
| GET    | `/api/v1/courses`      | Listar todos     | 200       |
| GET    | `/api/v1/courses/:id`  | Obtener por ID   | 200 / 404 |
| POST   | `/api/v1/courses`      | Crear curso      | 201 / 400 |
| PUT    | `/api/v1/courses/:id`  | Actualizar       | 200 / 404 |
| DELETE | `/api/v1/courses/:id`  | Eliminar         | 200 / 404 |
| GET    | `/health`              | Estado           | 200       |

## Body requerido (POST / PUT)

```json
{
  "codigo": "CUR001",
  "nombre": "Programación Orientada a Objetos",
  "creditos": 4,
  "docente": "Dr. Roberto Huanca"
}
```

## Ejecutar (desde la raíz del monorepo)

```bash
npm run dev:courses     # solo este servicio
npm run dev             # todos los servicios
npm run test:courses    # tests de este servicio
```

## Ejecutar (standalone - desde esta carpeta)

```bash
cd backend/course-service
npm install
npm test
npm run dev
```

## Variables de entorno

```dotenv
NODE_ENV=development
PORT=3002
SERVICE_NAME=course-service
DB_HOST=localhost
DB_PORT=5432
DB_NAME=universidad_db
DB_TEST_NAME=universidad_test_db
DB_USER=postgres
DB_PASSWORD=TuPassword
CORS_ORIGIN=*
```
