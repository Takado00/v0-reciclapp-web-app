-- Agregar todas las columnas que podrían faltar en la tabla usuarios

-- Agregar columna nombre si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'nombre'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN nombre TEXT;
    END IF;
END $$;

-- Agregar columna telefono si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'telefono'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN telefono TEXT;
    END IF;
END $$;

-- Agregar columna direccion si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'direccion'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN direccion TEXT;
    END IF;
END $$;

-- Agregar columna ciudad si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'ciudad'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN ciudad TEXT;
    END IF;
END $$;

-- Agregar columna descripcion si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'descripcion'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN descripcion TEXT;
    END IF;
END $$;

-- Agregar columna sitio_web si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'sitio_web'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN sitio_web TEXT;
    END IF;
END $$;

-- Agregar columna especialidad si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'especialidad'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN especialidad TEXT;
    END IF;
END $$;

-- Agregar columna horario_atencion si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'horario_atencion'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN horario_atencion TEXT;
    END IF;
END $$;

-- Agregar columna certificaciones si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'certificaciones'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN certificaciones TEXT[];
    END IF;
END $$;

-- Agregar columna materiales_aceptados si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'materiales_aceptados'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN materiales_aceptados TEXT[];
    END IF;
END $$;

-- Agregar columna foto_perfil si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'foto_perfil'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;
    END IF;
END $$;

-- Agregar columna redes_sociales si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'redes_sociales'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN redes_sociales JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Agregar columna intereses_reciclaje si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'intereses_reciclaje'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN intereses_reciclaje TEXT[];
    END IF;
END $$;

-- Agregar columna nivel_experiencia si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'nivel_experiencia'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN nivel_experiencia TEXT;
    END IF;
END $$;

-- Agregar columna biografia si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'biografia'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN biografia TEXT;
    END IF;
END $$;

-- Agregar columna educacion si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'educacion'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN educacion TEXT;
    END IF;
END $$;

-- Agregar columna anos_experiencia si no existe (sin tilde)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'anos_experiencia'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN anos_experiencia INTEGER;
    END IF;
END $$;

-- Agregar columna areas_servicio si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'areas_servicio'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN areas_servicio TEXT[];
    END IF;
END $$;

-- Verificar las columnas actuales de la tabla usuarios
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
