-- Verificar si la columna ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'areas_servicio'
    ) THEN
        -- Agregar la columna areas_servicio como un array de strings
        ALTER TABLE usuarios ADD COLUMN areas_servicio TEXT[];
    END IF;
END $$;

-- Confirmar que la columna existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name = 'areas_servicio';
