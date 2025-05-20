-- Verificar si la columna foto_perfil existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'foto_perfil'
    ) THEN
        -- Añadir la columna foto_perfil si no existe
        ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;
        RAISE NOTICE 'Columna foto_perfil añadida a la tabla usuarios';
    ELSE
        RAISE NOTICE 'La columna foto_perfil ya existe en la tabla usuarios';
    END IF;
END $$;

-- Actualizar los usuarios existentes con un valor por defecto para foto_perfil
UPDATE usuarios
SET foto_perfil = '/placeholder.svg?height=200&width=200&query=user'
WHERE foto_perfil IS NULL;
