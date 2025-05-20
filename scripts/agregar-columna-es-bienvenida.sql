-- Verificar si la columna es_bienvenida existe en la tabla conversaciones
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'conversaciones'
        AND column_name = 'es_bienvenida'
    ) THEN
        ALTER TABLE conversaciones ADD COLUMN es_bienvenida BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna es_bienvenida añadida a la tabla conversaciones';
    ELSE
        RAISE NOTICE 'La columna es_bienvenida ya existe en la tabla conversaciones';
    END IF;
END $$;
