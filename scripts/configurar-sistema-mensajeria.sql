-- Crear tabla de conversaciones si no existe
CREATE TABLE IF NOT EXISTS conversaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario1_id UUID NOT NULL,
    usuario2_id UUID NOT NULL,
    ultimo_mensaje TEXT,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_usuario1 FOREIGN KEY (usuario1_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario2 FOREIGN KEY (usuario2_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear tabla de mensajes si no existe
CREATE TABLE IF NOT EXISTS mensajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversacion_id UUID NOT NULL,
    emisor_id UUID NOT NULL,
    receptor_id UUID NOT NULL,
    contenido TEXT NOT NULL,
    enviado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    leido BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
    CONSTRAINT fk_emisor FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_receptor FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Asegurarse de que el usuario del sistema existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre = 'ReciclApp' AND correo = 'sistema@reciclapp.com') THEN
        INSERT INTO usuarios (nombre, correo, contrasena, tipo_usuario, fecha_registro)
        VALUES ('ReciclApp', 'sistema@reciclapp.com', 'sistema123', 'sistema', NOW());
    END IF;
END
$$;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario1 ON conversaciones(usuario1_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario2 ON conversaciones(usuario2_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_emisor ON mensajes(emisor_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_receptor ON mensajes(receptor_id);
