-- Verificar si la tabla notificaciones existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'notificaciones'
    ) THEN
        -- Crear la tabla notificaciones
        CREATE TABLE notificaciones (
            id SERIAL PRIMARY KEY,
            usuario_id UUID NOT NULL,
            titulo VARCHAR(255) NOT NULL,
            mensaje TEXT NOT NULL,
            tipo VARCHAR(50) NOT NULL,
            leida BOOLEAN DEFAULT FALSE,
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            referencia_id INTEGER,
            referencia_tipo VARCHAR(50),
            FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
        );
        
        -- Crear índices para mejorar el rendimiento
        CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
        CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
        CREATE INDEX idx_notificaciones_fecha_creacion ON notificaciones(fecha_creacion);
        
        RAISE NOTICE 'Tabla notificaciones creada con éxito';
    ELSE
        RAISE NOTICE 'La tabla notificaciones ya existe';
    END IF;
END $$;

-- Insertar algunas notificaciones de ejemplo para pruebas
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, fecha_creacion)
SELECT 
  id, 
  'Bienvenido a ReciclApp', 
  'Gracias por unirte a nuestra comunidad de reciclaje. Explora materiales y conecta con recicladores.',
  'sistema',
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM notificaciones 
  WHERE titulo = 'Bienvenido a ReciclApp' 
  AND usuario_id = auth.users.id
)
LIMIT 5;

-- Insertar notificación de nuevo material
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, fecha_creacion)
SELECT 
  id, 
  'Nuevos materiales disponibles', 
  'Se han añadido nuevos materiales reciclables cerca de tu ubicación.',
  'material_nuevo',
  NOW() - INTERVAL '1 day'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM notificaciones 
  WHERE titulo = 'Nuevos materiales disponibles' 
  AND usuario_id = auth.users.id
)
LIMIT 10;

-- Insertar notificación de mensaje
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, fecha_creacion)
SELECT 
  id, 
  'Tienes un nuevo mensaje', 
  'Has recibido un mensaje sobre uno de tus materiales publicados.',
  'mensaje_nuevo',
  NOW() - INTERVAL '2 days'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM notificaciones 
  WHERE titulo = 'Tienes un nuevo mensaje' 
  AND usuario_id = auth.users.id
)
LIMIT 10;

-- Insertar notificación de evento
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, fecha_creacion)
SELECT 
  id, 
  'Evento de reciclaje próximo', 
  'Se realizará un evento de reciclaje comunitario este fin de semana en tu zona.',
  'evento',
  NOW() - INTERVAL '3 days'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM notificaciones 
  WHERE titulo = 'Evento de reciclaje próximo' 
  AND usuario_id = auth.users.id
)
LIMIT 10;
