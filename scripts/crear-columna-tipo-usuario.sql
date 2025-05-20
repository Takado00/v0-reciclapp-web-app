-- Verificar si la columna tipo_usuario ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'usuarios'
        AND column_name = 'tipo_usuario'
    ) THEN
        -- Añadir la columna tipo_usuario si no existe
        ALTER TABLE usuarios ADD COLUMN tipo_usuario VARCHAR(50);
        
        -- Actualizar la columna tipo_usuario basado en rol_id
        UPDATE usuarios SET tipo_usuario = 
            CASE 
                WHEN rol_id = 1 THEN 'usuario'
                WHEN rol_id = 2 THEN 'reciclador'
                WHEN rol_id = 3 THEN 'empresa'
                WHEN rol_id = 4 THEN 'admin'
                ELSE 'usuario'
            END;
            
        RAISE NOTICE 'Columna tipo_usuario añadida y actualizada correctamente';
    ELSE
        RAISE NOTICE 'La columna tipo_usuario ya existe';
    END IF;
END $$;
