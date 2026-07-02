-- =====================================================
-- Script de la Base de Datos - Versión: 1.0.0
-- =====================================================

-- =====================================================
-- TABLA: estudiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE estudiantes IS 'Registro de estudiantes de la universidad';
COMMENT ON COLUMN estudiantes.codigo IS 'Código único del estudiante (ej: EST001)';
COMMENT ON COLUMN estudiantes.nombres IS 'Nombres del estudiante';
COMMENT ON COLUMN estudiantes.apellidos IS 'Apellidos del estudiante';
COMMENT ON COLUMN estudiantes.correo IS 'Correo institucional único';
COMMENT ON COLUMN estudiantes.carrera IS 'Carrera o programa académico';

-- =====================================================
-- TABLA: cursos
-- =====================================================
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos >= 1 AND creditos <= 10),
    docente VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE cursos IS 'Registro de cursos académicos';
COMMENT ON COLUMN cursos.codigo IS 'Código único del curso (ej: CUR001)';
COMMENT ON COLUMN cursos.nombre IS 'Nombre completo del curso';
COMMENT ON COLUMN cursos.creditos IS 'Créditos académicos (1-10)';
COMMENT ON COLUMN cursos.docente IS 'Nombre del docente responsable';

-- =====================================================
-- FUNCIÓN TRIGGER: auto-actualizar updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================
DROP TRIGGER IF EXISTS trg_estudiantes_updated_at ON estudiantes;
CREATE TRIGGER trg_estudiantes_updated_at
    BEFORE UPDATE ON estudiantes
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_cursos_updated_at ON cursos;
CREATE TRIGGER trg_cursos_updated_at
    BEFORE UPDATE ON cursos
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- =====================================================
-- ÍNDICES para mejorar rendimiento
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_estudiantes_codigo ON estudiantes(codigo);
CREATE INDEX IF NOT EXISTS idx_estudiantes_correo ON estudiantes(correo);
CREATE INDEX IF NOT EXISTS idx_estudiantes_carrera ON estudiantes(carrera);

CREATE INDEX IF NOT EXISTS idx_cursos_codigo ON cursos(codigo);
CREATE INDEX IF NOT EXISTS idx_cursos_docente ON cursos(docente);
CREATE INDEX IF NOT EXISTS idx_cursos_creditos ON cursos(creditos);

-- =====================================================
-- STORED PROCEDURES / FUNCIONES
-- =====================================================

-- SP 1: Estadísticas de estudiantes por carrera
CREATE OR REPLACE FUNCTION sp_estadisticas_por_carrera()
RETURNS TABLE (
    carrera TEXT,
    total_estudiantes BIGINT
) AS $$
BEGIN
    RETURN QUERY
        SELECT e.carrera::TEXT, COUNT(*)::BIGINT AS total_estudiantes
        FROM estudiantes e
        GROUP BY e.carrera
        ORDER BY total_estudiantes DESC;
END;
$$ LANGUAGE plpgsql;

-- SP 2: Buscar estudiante por código
CREATE OR REPLACE FUNCTION sp_buscar_estudiante_por_codigo(p_codigo VARCHAR)
RETURNS TABLE (
    id INT,
    codigo VARCHAR,
    nombres VARCHAR,
    apellidos VARCHAR,
    correo VARCHAR,
    carrera VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
        SELECT e.id, e.codigo, e.nombres, e.apellidos,
               e.correo, e.carrera, e.created_at, e.updated_at
        FROM estudiantes e
        WHERE e.codigo = p_codigo;
END;
$$ LANGUAGE plpgsql;

-- SP 3: Cursos filtrados por mínimo de créditos
CREATE OR REPLACE FUNCTION sp_cursos_por_creditos(p_min_creditos INT DEFAULT 1)
RETURNS TABLE (
    id INT,
    codigo VARCHAR,
    nombre VARCHAR,
    creditos INT,
    docente VARCHAR
) AS $$
BEGIN
    RETURN QUERY
        SELECT c.id, c.codigo, c.nombre, c.creditos, c.docente
        FROM cursos c
        WHERE c.creditos >= p_min_creditos
        ORDER BY c.creditos DESC, c.nombre ASC;
END;
$$ LANGUAGE plpgsql;

-- SP 4: Reporte combinado (uso futuro)
CREATE OR REPLACE FUNCTION sp_resumen_plataforma()
RETURNS TABLE (
    total_estudiantes BIGINT,
    total_cursos BIGINT,
    creditos_promedio NUMERIC
) AS $$
BEGIN
    RETURN QUERY
        SELECT
            (SELECT COUNT(*) FROM estudiantes)::BIGINT,
            (SELECT COUNT(*) FROM cursos)::BIGINT,
            (SELECT ROUND(AVG(creditos), 2) FROM cursos);
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    RAISE NOTICE 'Schema creado exitosamente';
END $$;