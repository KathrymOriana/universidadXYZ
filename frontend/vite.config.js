import { defineConfig } from 'vite';

export default defineConfig({
    // Directorio raíz donde están los HTML
    root: '.',

    // Assets estáticos (css/, js/) van en public/
    publicDir: 'public',

    server: {
        port: 4000,
        open: true,

        // Proxy: las llamadas a /api/v1 van al API Gateway
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/health': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },

    // Configuración Multi-Page Application (MPA)
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html',
                students: './students.html',
                courses: './courses.html',
                services: './services.html',
            },
        },
    },
});