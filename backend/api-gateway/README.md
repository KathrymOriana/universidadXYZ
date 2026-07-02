# 🌐 API Gateway — Puerto 3000

Punto de entrada centralizado para todos los microservicios.

## Rutas disponibles

| Ruta                   | Destino              |
|------------------------|----------------------|
| `/api/v1/students/*`   | student-service:3001 |
| `/api/v1/courses/*`    | course-service:3002  |
| `/health`              | Estado del gateway   |
| `/health/students`     | Health proxeado      |
| `/health/courses`      | Health proxeado      |

## Ejecutar (desde la raíz del monorepo)

```bash
npm run dev:gateway   # solo el gateway
npm run dev           # todos los servicios
```

⚠️ Los microservicios deben estar activos primero.

## Variables de entorno

```dotenv
NODE_ENV=development
PORT=3000
SERVICE_NAME=api-gateway
STUDENT_SERVICE_URL=http://localhost:3001
COURSE_SERVICE_URL=http://localhost:3002
```
