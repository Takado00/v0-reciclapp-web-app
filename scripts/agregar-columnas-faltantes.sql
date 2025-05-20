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

-- Verificar las columnas actuales de la tabla usuarios
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
