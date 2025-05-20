-- Verificar si la extensión uuid-ossp está instalada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eliminar tablas existentes si es necesario
DROP TABLE IF EXISTS mensajes;
DROP TABLE IF EXISTS conversaciones;

-- Crear la tabla conversaciones con la estructura correcta
CREATE TABLE conversaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    otro_usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    ultimo_mensaje TEXT,
    fecha_ultimo_mensaje TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    no_leidos INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear la tabla mensajes con la estructura correcta
CREATE TABLE mensajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
    emisor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    receptor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_conversaciones_usuario_id ON conversaciones(usuario_id);
CREATE INDEX idx_conversaciones_otro_usuario_id ON conversaciones(otro_usuario_id);
CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
CREATE INDEX idx_mensajes_emisor_id ON mensajes(emisor_id);
CREATE INDEX idx_mensajes_receptor_id ON mensajes(receptor_id);

-- Crear función para incrementar valores
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
BEGIN
    RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

-- Insertar roles si no existen
INSERT INTO roles (nombre, descripcion)
SELECT 'usuario', 'Usuario normal'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'usuario');

INSERT INTO roles (nombre, descripcion)
SELECT 'reciclador', 'Reciclador profesional'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'reciclador');

INSERT INTO roles (nombre, descripcion)
SELECT 'empresa', 'Empresa de reciclaje'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'empresa');

INSERT INTO roles (nombre, descripcion)
SELECT 'admin', 'Administrador del sistema'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'admin');
