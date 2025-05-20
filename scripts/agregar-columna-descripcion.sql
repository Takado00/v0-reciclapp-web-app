-- Verificar si la columna 'descripcion' existe en la tabla 'usuarios'
DO $$
BEGIN
    -- Intentar agregar la columna si no existe
    BEGIN
        ALTER TABLE usuarios ADD COLUMN descripcion TEXT;
        RAISE NOTICE 'Columna descripcion agregada a la tabla usuarios';
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'La columna descripcion ya existe en la tabla usuarios';
    END;
END $$;
