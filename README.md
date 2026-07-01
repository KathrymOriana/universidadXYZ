# 🎓 Universidad Tecnológica XYZ — Backend Platform

Sistema de gestión académica desarrollado con una arquitectura basada en microservicios.
El proyecto permite administrar estudiantes y cursos a través de servicios independientes, centralizados mediante un API Gateway y consumidos por un frontend web.

## 🏗️ Arquitectura

                 ┌───────────────────────────────┐
                 │           Frontend            │
                 │      Dashboard Web (4000)     │
                 └───────────────┬───────────────┘
                                 │ HTTP / REST
                                 │
                 ┌───────────────▼───────────────┐
                 │          API Gateway          │
                 │         Puerto: 3000          │
                 └───────────────┬───────────────┘
                                 │
             ┌───────────────────┴──────────────────┐
             │                                      │
             ▼                                      ▼
    ┌─────────────────┐                   ┌───────────────────┐
    │ Student Service │                   │  Course Service   │
    │  Puerto: 3001   │                   │  Puerto: 3002     │
    └────────┬────────┘                   └─────────┬─────────┘
             │                                      │
             └───────────────────┬──────────────────┘
                                 │
                        ┌────────▼────────┐
                        │   PostgreSQL    │
                        │ universidad_db  │
                        └─────────────────┘

### Componentes principales

- **Frontend**: Interfaz web para la gestión académica.
- **API Gateway**: Punto de entrada centralizado para todas las solicitudes HTTP.
- **Student Service**: Gestión de estudiantes.
- **Course Service**: Gestión de cursos.
- **PostgreSQL**: Base de datos relacional.

## 📁 Estructura del Proyecto

    universidadXYZ/
    ├── backend/
    │   ├── database/          → Scripts SQL (schema + seed)
    │   ├── student-service/   → Microservicio estudiantes
    │   ├── course-service/    → Microservicio cursos
    │   └── api-gateway/       → Gateway centralizado
    ├── frontend/              → Dashboard web
    ├── package.json           → Workspaces + scripts globales
    └── scripts/               → Utilidades de configuración

## 🛠️ Tecnologías

| Tecnología            | Versión     | Propósito                 |
|-----------------------|-------------|---------------------------|
| Node.js               | 22.x LTS    | Runtime JS                |
| Express.js            | 5.2.x       | Framework HTTP            |
| PostgreSQL            | 17.x / 18.x | Base de datos             |
| Jest                  | 30.x        | Unit Testing              |
| Supertest             | 7.x         | Integration Testing       |
| express-validator     | 7.x         | Validación de datos       |
| helmet                | 8.x         | Seguridad HTTP            |
| morgan                | 1.10.x      | Logging HTTP              |
| http-proxy-middleware | 3.x         | API Gateway proxy         |
| npm workspaces        | 7.x         | Gestión de monorepo       |
| concurrently          | 10.x        | Ejecución paralela        |
| Vite                  | 8.1.2       | Build y servidor frontend |
| Bootstrap             | 5.3         | Framework CSS             |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 22.x LTS
- PostgreSQL 17.x o superior
- Git 2.53.x

### 1. Clonar el repositorio

    git clone https://github.com/KathrymOriana/universidadXYZ.git
    cd universidadXYZ

### 2. Configurar variables de entorno

    npm run setup:envs
    # Luego edita cada .env generado con tu DB_PASSWORD real

Archivos generados:

- `backend/student-service/.env`
- `backend/course-service/.env`
- `backend/api-gateway/.env`
- `frontend/.env`

### 3. Instalar TODAS las dependencias (una sola vez)

    npm install

### 3. Configurar la base de datos

```bash
psql -U postgres -c "CREATE DATABASE universidad_db;"
psql -U postgres -c "CREATE DATABASE universidad_test_db;"
npm run db:schema
npm run db:seed
psql -U postgres -d universidad_test_db -f backend/database/schema.sql
```

### 6. Iniciar TODO el proyecto (una sola terminal)

    npm run dev

Abre [http://localhost:4000](http://localhost:4000) en el navegador.

## 🧪 Testing

```bash
npm run test            # Todos los tests (student + course)
npm run test:students   # Solo student-service
npm run test:courses    # Solo course-service
npm run test:unit       # Solo pruebas unitarias
```

## 🌐 URLs del sistema

| Servicio        | URL                                                                            |
|-----------------|--------------------------------------------------------------------------------|
| Frontend        | [http://localhost:4000](http://localhost:4000)                                 |
| API Gateway     | [http://localhost:3000](http://localhost:3000)                                 |
| Health Gateway  | [http://localhost:3000/health](http://localhost:3000/health)                   |
| Students API    | [http://localhost:3000/api/v1/students](http://localhost:3000/api/v1/students) |
| Courses API     | [http://localhost:3000/api/v1/courses](http://localhost:3000/api/v1/courses)   |

## 📋 Scripts disponibles

| Comando                | Descripción                                |
|------------------------|--------------------------------------------|
| `npm run setup:envs`   | Crea los archivos .env desde .env.example  |
| `npm install`          | Instala TODAS las dependencias del monorepo|
| `npm run db:setup`     | Aplica schema + seed a la base de datos    |
| `npm run dev`          | Inicia todos los servicios en paralelo     |
| `npm run dev:backend`  | Inicia solo los 3 servicios backend        |
| `npm run dev:students` | Inicia solo student-service                |
| `npm run dev:courses`  | Inicia solo course-service                 |
| `npm run dev:gateway`  | Inicia solo api-gateway                    |
| `npm run dev:frontend` | Inicia solo el frontend (Vite)             |
| `npm run test`         | Corre todos los tests con cobertura        |
| `npm run test:students`| Tests del student-service                  |
| `npm run test:courses` | Tests del course-service                   |
| `npm run build`        | Build de producción del frontend           |

## 👥 Equipo de Desarrollo

Proyecto desarrollado de forma individual por **Kathrym Paredes**.

## 📄 Licencia

Proyecto académico desarrollado bajo la licencia MIT © 2026 Kathrym Paredes
