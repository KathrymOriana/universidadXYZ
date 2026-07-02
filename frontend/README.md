# 🖥️ Frontend Dashboard — Puerto 4000

Dashboard web para la gestión de estudiantes y cursos de la universidad con HMR (Hot Module Replacement) mediante Vite.

## Páginas

| Ruta        | Descripción                |
|-------------|----------------------------|
| `/`         | Dashboard con estadísticas |
| `/students` | CRUD de estudiantes        |
| `/courses`  | CRUD de cursos             |
| `/services` | Estado de microservicios   |

## Ejecutar (desde la raíz del monorepo)

```bash
npm run dev:frontend   # Vite con HMR (desarrollo)
npm run dev            # Todos los servicios
npm run build          # Build de producción
```

Abrir: [http://localhost:4000](http://localhost:4000)

## HMR — Hot Module Replacement

- **CSS** → se inyecta instantáneamente, SIN recargar la página
- **HTML** → recarga automática al guardar
- **JS**  → recarga automática al guardar

## Variables de entorno

```dotenv
PORT=4000
API_GATEWAY_URL=http://localhost:3000
```
