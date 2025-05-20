-- Verificar si la tabla conversaciones existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'conversaciones'
    ) THEN
        -- Crear la tabla conversaciones con las relaciones correctas
        CREATE TABLE conversaciones (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            usuario1_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            usuario2_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            ultimo_mensaje TEXT,
            ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            es_bienvenida BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear índices para mejorar el rendimiento
        CREATE INDEX idx_conversaciones_usuario1_id ON conversaciones(usuario1_id);
        CREATE INDEX idx_conversaciones_usuario2_id ON conversaciones(usuario2_id);
        
        RAISE NOTICE 'Tabla conversaciones creada con relaciones correctas';
    ELSE
        -- Verificar si las relaciones existen
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'conversaciones'
            AND ccu.column_name = 'id'
            AND ccu.table_name = 'usuarios'
            AND tc.constraint_name LIKE '%usuario1_id%'
        ) THEN
            -- Eliminar la tabla y recrearla con las relaciones correctas
            DROP TABLE IF EXISTS mensajes;
            DROP TABLE IF EXISTS conversaciones;
            
            -- Crear la tabla conversaciones con las relaciones correctas
            CREATE TABLE conversaciones (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                usuario1_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                usuario2_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                ultimo_mensaje TEXT,
                ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                es_bienvenida BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Crear índices para mejorar el rendimiento
            CREATE INDEX idx_conversaciones_usuario1_id ON conversaciones(usuario1_id);
            CREATE INDEX idx_conversaciones_usuario2_id ON conversaciones(usuario2_id);
            
            RAISE NOTICE 'Tabla conversaciones recreada con relaciones correctas';
        ELSE
            RAISE NOTICE 'Las relaciones ya existen en la tabla conversaciones';
        END IF;
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
        -- Crear la tabla mensajes con las relaciones correctas
        CREATE TABLE mensajes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
            emisor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            receptor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            contenido TEXT NOT NULL,
            enviado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            leido BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear índices para mejorar el rendimiento
        CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
        CREATE INDEX idx_mensajes_emisor_id ON mensajes(emisor_id);
        CREATE INDEX idx_mensajes_receptor_id ON mensajes(receptor_id);
        
        RAISE NOTICE 'Tabla mensajes creada con relaciones correctas';
    ELSE
        -- Verificar si las relaciones existen
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'mensajes'
            AND ccu.column_name = 'id'
            AND ccu.table_name = 'conversaciones'
        ) THEN
            -- Eliminar la tabla y recrearla con las relaciones correctas
            DROP TABLE IF EXISTS mensajes;
            
            -- Crear la tabla mensajes con las relaciones correctas
            CREATE TABLE mensajes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
                emisor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                receptor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
                contenido TEXT NOT NULL,
                enviado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                leido BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Crear índices para mejorar el rendimiento
            CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
            CREATE INDEX idx_mensajes_emisor_id ON mensajes(emisor_id);
            CREATE INDEX idx_mensajes_receptor_id ON mensajes(receptor_id);
            
            RAISE NOTICE 'Tabla mensajes recreada con relaciones correctas';
        ELSE
            RAISE NOTICE 'Las relaciones ya existen en la tabla mensajes';
        END IF;
    END IF;
END $$;

-- Crear el usuario del sistema (ReciclApp) si no existe
DO $$
DECLARE
    sistema_id UUID;
BEGIN
    -- Verificar si la columna es_sistema existe
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'es_sistema'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN es_sistema BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Columna es_sistema añadida a la tabla usuarios';
    END IF;
    
    -- Verificar si la columna tipo_usuario existe
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'tipo_usuario'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN tipo_usuario VARCHAR(50) DEFAULT 'usuario';
        RAISE NOTICE 'Columna tipo_usuario añadida a la tabla usuarios';
    END IF;
    
    -- Verificar si existe el usuario del sistema
    SELECT id INTO sistema_id FROM usuarios WHERE es_sistema = TRUE LIMIT 1;
    
    IF sistema_id IS NULL THEN
        INSERT INTO usuarios (nombre, correo, contrasena, es_sistema, tipo_usuario, fecha_registro)
        VALUES ('ReciclApp', 'sistema@reciclapp.com', 'sistema123', TRUE, 'sistema', NOW())
        RETURNING id INTO sistema_id;
        
        RAISE NOTICE 'Usuario del sistema creado con ID: %', sistema_id;
    ELSE
        RAISE NOTICE 'El usuario del sistema ya existe con ID: %', sistema_id;
    END IF;
END $$;
