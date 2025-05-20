-- Verificar si la columna intereses_reciclaje existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'intereses_reciclaje'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN intereses_reciclaje TEXT[];
    END IF;
END $$;

-- Verificar si la columna areas_servicio existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'areas_servicio'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN areas_servicio TEXT[];
    END IF;
END $$;

-- Verificar si la columna certificaciones existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'certificaciones'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN certificaciones TEXT[];
    END IF;
END $$;

-- Verificar si la columna materiales_aceptados existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'materiales_aceptados'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN materiales_aceptados TEXT[];
    END IF;
END $$;

-- Verificar si la columna redes_sociales existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'redes_sociales'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN redes_sociales JSONB;
    END IF;
END $$;

-- Verificar si la columna anos_experiencia existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'anos_experiencia'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN anos_experiencia INTEGER;
    END IF;
END $$;

-- Verificar si la columna ocupacion existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'ocupacion'
    ) THEN
        -- Si no existe, la agregamos
        ALTER TABLE usuarios ADD COLUMN ocupacion VARCHAR(100);
    END IF;
END $$;

-- Mostrar la estructura actual de la tabla usuarios
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
