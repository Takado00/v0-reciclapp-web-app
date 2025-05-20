-- Verificar si la columna es_sistema existe en la tabla usuarios
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

-- Verificar si la columna tipo_usuario existe en la tabla usuarios
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

-- Verificar si la columna apellido existe en la tabla usuarios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        AND column_name = 'apellido'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN apellido VARCHAR(255);
        RAISE NOTICE 'Columna apellido añadida a la tabla usuarios';
    ELSE
        RAISE NOTICE 'La columna apellido ya existe en la tabla usuarios';
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
            usuario1_id UUID NOT NULL,
            usuario2_id UUID NOT NULL,
            ultimo_mensaje TEXT,
            ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            es_bienvenida BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear índices para mejorar el rendimiento
        CREATE INDEX idx_conversaciones_usuario1_id ON conversaciones(usuario1_id);
        CREATE INDEX idx_conversaciones_usuario2_id ON conversaciones(usuario2_id);
        
        RAISE NOTICE 'Tabla conversaciones creada';
    ELSE
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
            conversacion_id UUID NOT NULL,
            emisor_id UUID NOT NULL,
            receptor_id UUID NOT NULL,
            contenido TEXT NOT NULL,
            enviado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            leido BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear índices para mejorar el rendimiento
        CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
        CREATE INDEX idx_mensajes_emisor_id ON mensajes(emisor_id);
        CREATE INDEX idx_mensajes_receptor_id ON mensajes(receptor_id);
        
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

-- Insertar algunos usuarios de ejemplo si no existen
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios
        WHERE nombre = 'Juan' AND apellido = 'Pérez' AND tipo_usuario = 'reciclador'
    ) THEN
        INSERT INTO usuarios (nombre, apellido, correo, contrasena, tipo_usuario, fecha_registro)
        VALUES ('Juan', 'Pérez', 'juan@ejemplo.com', 'password123', 'reciclador', NOW());
        
        RAISE NOTICE 'Usuario de ejemplo Juan Pérez creado';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios
        WHERE nombre = 'EcoRecicla' AND tipo_usuario = 'empresa'
    ) THEN
        INSERT INTO usuarios (nombre, correo, contrasena, tipo_usuario, fecha_registro)
        VALUES ('EcoRecicla', 'info@ecorecicla.com', 'password123', 'empresa', NOW());
        
        RAISE NOTICE 'Usuario de ejemplo EcoRecicla creado';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios
        WHERE nombre = 'María' AND apellido = 'González' AND tipo_usuario = 'reciclador'
    ) THEN
        INSERT INTO usuarios (nombre, apellido, correo, contrasena, tipo_usuario, fecha_registro)
        VALUES ('María', 'González', 'maria@ejemplo.com', 'password123', 'reciclador', NOW());
        
        RAISE NOTICE 'Usuario de ejemplo María González creado';
    END IF;
END $$;
