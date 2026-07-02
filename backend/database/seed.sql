-- =====================================================
-- DATOS DE PRUEBA (SEED DATA) - v1.0
-- =====================================================

TRUNCATE TABLE estudiantes RESTART IDENTITY CASCADE;
TRUNCATE TABLE cursos RESTART IDENTITY CASCADE;

-- =====================================================
-- ESTUDIANTES (30 registros)
-- =====================================================
INSERT INTO estudiantes (codigo, nombres, apellidos, correo, carrera) VALUES
    ('EST001', 'Juan Carlos', 'Garcia Lopez', 'juan.garcia@universidadxyz.edu.pe', 'Ingenieria de Sistemas'),
    ('EST002', 'Maria Elena', 'Rodriguez Perez', 'maria.rodriguez@universidadxyz.edu.pe', 'Ingenieria Civil'),
    ('EST003', 'Pedro Antonio', 'Martinez Silva', 'pedro.martinez@universidadxyz.edu.pe', 'Ingenieria de Software'),
    ('EST004', 'Ana Sofia', 'Torres Vega', 'ana.torres@universidadxyz.edu.pe', 'Administracion de Empresas'),
    ('EST005', 'Carlos Miguel', 'Flores Quispe', 'carlos.flores@universidadxyz.edu.pe', 'Ingenieria de Sistemas'),
    ('EST006', 'Lucia Isabel', 'Mamani Condori', 'lucia.mamani@universidadxyz.edu.pe', 'Contabilidad'),
    ('EST007', 'Diego Alonso', 'Apaza Huanca', 'diego.apaza@universidadxyz.edu.pe', 'Ingenieria de Software'),
    ('EST008', 'Valeria Rosa', 'Quispe Ccama', 'valeria.quispe@universidadxyz.edu.pe', 'Medicina Humana'),
    ('EST009', 'Rodrigo Sebastian', 'Paredes Cardenas', 'rodrigo.paredes@universidadxyz.edu.pe', 'Ingenieria de Sistemas'),
    ('EST010', 'Camila Alejandra', 'Vargas Soto', 'camila.vargas@universidadxyz.edu.pe', 'Psicologia'),
    ('EST011', 'Fernando Jose', 'Huanca Ticona', 'fernando.huanca@universidadxyz.edu.pe', 'Ingenieria Civil'),
    ('EST012', 'Daniela Paola', 'Callo Choque', 'daniela.callo@universidadxyz.edu.pe', 'Administracion de Empresas'),
    ('EST013', 'Oscar Renato', 'Lazo Puma', 'oscar.lazo@universidadxyz.edu.pe', 'Ingenieria de Software'),
    ('EST014', 'Gabriela Milagros', 'Sanchez Ramos', 'gabriela.sanchez@universidadxyz.edu.pe', 'Contabilidad'),
    ('EST015', 'Luis Enrique', 'Chavez Medina', 'luis.chavez@universidadxyz.edu.pe', 'Ingenieria de Sistemas'),
    ('EST016', 'Paola Fernanda', 'Ramos Villanueva', 'paola.ramos@universidadxyz.edu.pe', 'Medicina Humana'),
    ('EST017', 'Sebastian Andres', 'Cruz Landa', 'sebastian.cruz@universidadxyz.edu.pe', 'Ingenieria de Software'),
    ('EST018', 'Natalia Cristina', 'Bejarano Sucari', 'natalia.bejarano@universidadxyz.edu.pe', 'Psicologia'),
    ('EST019', 'Ximena Valeria', 'Carpio Nuñez', 'ximena.carpio@universidadxyz.edu.pe', 'Administracion de Empresas'),
    ('EST020', 'Martin Eduardo', 'Zuñiga Coaquira', 'martin.zuniga@universidadxyz.edu.pe', 'Ingenieria Civil'),
    ('EST021', 'Renata Luciana', 'Molina Pinto', 'renata.molina@universidadxyz.edu.pe', 'Contabilidad'),
    ('EST022', 'Alexis Omar', 'Pinto Cutipa', 'alexis.pinto@universidadxyz.edu.pe', 'Ingenieria de Sistemas'),
    ('EST023', 'Fatima Alejandra', 'Quispe Arapa', 'fatima.quispe@universidadxyz.edu.pe', 'Medicina Humana'),
    ('EST024', 'Bruno Ignacio', 'Salinas Roque', 'bruno.salinas@universidadxyz.edu.pe', 'Ingenieria de Software'),
    ('EST025', 'Andrea Stephanie', 'Ccallo Mamani', 'andrea.ccallo@universidadxyz.edu.pe', 'Psicologia'),
    ('EST026', 'Hector Javier', 'Llerena Tapia', 'hector.llerena@universidadxyz.edu.pe', 'Ingenieria Civil'),
    ('EST027', 'Sofia Beatriz', 'Aquino Turpo', 'sofia.aquino@universidadxyz.edu.pe', 'Administracion de Empresas'),
    ('EST028', 'Gonzalo Patricio', 'Medina Caceres', 'gonzalo.medina@universidadxyz.edu.pe', 'Ingenieria de Sistemas'),
    ('EST029', 'Claudia Vanessa', 'Ttito Hallasi', 'claudia.ttito@universidadxyz.edu.pe', 'Contabilidad'),
    ('EST030', 'Ricardo Emilio', 'Bustamante Vera', 'ricardo.bustamante@universidadxyz.edu.pe', 'Ingenieria de Software');

-- =====================================================
-- CURSOS (20 registros)
-- =====================================================
INSERT INTO cursos (codigo, nombre, creditos, docente) VALUES
    ('CUR001', 'Programacion Orientada a Objetos', 4, 'Dr. Roberto Huanca Mamani'),
    ('CUR002', 'Base de Datos I', 3, 'Mg. Patricia Condori Flores'),
    ('CUR003', 'Arquitectura de Software', 4, 'Dr. Miguel angel Salinas Rios'),
    ('CUR004', 'Desarrollo Web Full Stack', 5, 'Mg. Lucia Fernandez Apaza'),
    ('CUR005', 'Redes de Computadores', 3, 'Dr. Fernando Apaza Torres'),
    ('CUR006', 'Matematicas Discretas', 4, 'Mg. Rosa Linda Chavez Quispe'),
    ('CUR007', 'Ingenieria de Software', 4, 'Dr. Carlos Mendoza Lopez'),
    ('CUR008', 'Seguridad Informatica', 3, 'Mg. Sandra Vargas Ccari'),
    ('CUR009', 'Estructura de Datos y Algoritmos', 4, 'Dr. Javier Ticona Quispe'),
    ('CUR010', 'Calculo Diferencial e Integral', 4, 'Mg. Veronica Lazo Cutipa'),
    ('CUR011', 'Sistemas Operativos', 3, 'Dr. Ernesto Puma Coaquira'),
    ('CUR012', 'Inteligencia Artificial', 5, 'Dr. Alfredo Bejarano Soto'),
    ('CUR013', 'Programacion Funcional', 3, 'Mg. Carla Aquino Ramos'),
    ('CUR014', 'Diseño de Interfaces de Usuario', 3, 'Mg. Milagros Ccallo Turpo'),
    ('CUR015', 'Estadistica para Ingenieria', 3, 'Dr. Hugo Paredes Vera'),
    ('CUR016', 'Base de Datos II', 4, 'Mg. Patricia Condori Flores'),
    ('CUR017', 'Computacion en la Nube', 4, 'Dr. Ramiro Zuñiga Hallasi'),
    ('CUR018', 'Gestion de Proyectos de Software', 3, 'Mg. Elena Caceres Bustamante'),
    ('CUR019', 'Compiladores e Interpretes', 4, 'Dr. Sergio Llerena Pinto'),
    ('CUR020', 'Etica y Legislacion Informatica', 2, 'Mg. Diana Molina Tapia');

-- =====================================================
-- VERIFICACION
-- =====================================================
SELECT 'estudiantes' AS tabla, COUNT(*) AS registros FROM estudiantes
UNION ALL
SELECT 'cursos', COUNT(*) FROM cursos;

SELECT * FROM sp_estadisticas_por_carrera();
SELECT * FROM sp_resumen_plataforma();