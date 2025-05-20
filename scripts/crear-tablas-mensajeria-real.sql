-- Verificar y crear la columna es_sistema en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'es_sistema'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN es_sistema BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna es_sistema añadida a la tabla usuarios';
    ELSE
        RAISE NOTICE 'La columna es_sistema ya existe en la tabla usuarios';
    END IF;
END $$;

-- Verificar y crear la columna tipo_usuario en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'tipo_usuario'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN tipo_usuario VARCHAR(50) DEFAULT 'usuario';
        RAISE NOTICE 'Columna tipo_usuario añadida a la tabla usuarios';
    ELSE
        RAISE NOTICE 'La columna tipo_usuario ya existe en la tabla usuarios';
    END IF;
END $$;

-- Verificar si la tabla conversaciones existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'conversaciones'
    ) THEN
        -- Crear la tabla conversaciones
        CREATE TABLE conversaciones (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            usuario1_id UUID NOT NULL REFERENCES usuarios(id),
            usuario2_id UUID NOT NULL REFERENCES usuarios(id),
            ultimo_mensaje TEXT,
            ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            es_bienvenida BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla conversaciones creada';
    ELSE
        -- Verificar y añadir la columna es_bienvenida si no existe
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
        
        RAISE NOTICE 'La tabla conversaciones ya existe';
    END IF;
END $$;

-- Verificar si la tabla mensajes existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'mensajes'
    ) THEN
        -- Crear la tabla mensajes
        CREATE TABLE mensajes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversacion_id UUID NOT NULL REFERENCES conversaciones(id),
            emisor_id UUID NOT NULL REFERENCES usuarios(id),
            receptor_id UUID NOT NULL REFERENCES usuarios(id),
            contenido TEXT NOT NULL,
            enviado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            leido BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla mensajes creada';
    ELSE
        RAISE NOTICE 'La tabla mensajes ya existe';
    END IF;
END $$;

-- Crear el usuario del sistema (ReciclApp) si no existe
DO $$
DECLARE
    sistema_id UUID;
BEGIN
    SELECT id INTO sistema_id FROM usuarios WHERE es_sistema = TRUE LIMIT 1;
    
    IF sistema_id IS NULL THEN
        INSERT INTO usuarios (nombre, correo, es_sistema, tipo_usuario, fecha_registro)
        VALUES ('ReciclApp', 'sistema@reciclapp.com', TRUE, 'sistema', NOW())
        RETURNING id INTO sistema_id;
        
        RAISE NOTICE 'Usuario del sistema creado con ID: %', sistema_id;
    ELSE
        RAISE NOTICE 'El usuario del sistema ya existe con ID: %', sistema_id;
    END IF;
END $$;
