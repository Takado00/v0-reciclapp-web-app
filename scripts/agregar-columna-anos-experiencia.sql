-- Verificar si la columna anos_experiencia existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'anos_experiencia'
    ) THEN
        -- Agregar la columna anos_experiencia si no existe
        ALTER TABLE usuarios ADD COLUMN anos_experiencia INTEGER;
    END IF;
END $$;

-- Verificar si la columna años_experiencia existe (con tilde)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'años_experiencia'
    ) THEN
        -- Si existe la columna con tilde, copiar los datos a la nueva columna sin tilde
        UPDATE usuarios SET anos_experiencia = "años_experiencia";
        -- Y luego eliminar la columna con tilde
        ALTER TABLE usuarios DROP COLUMN "años_experiencia";
    END IF;
END $$;

-- Verificar que la columna se haya agregado correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name = 'anos_experiencia';
