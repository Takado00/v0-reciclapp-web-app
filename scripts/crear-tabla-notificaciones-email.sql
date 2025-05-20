-- Crear tabla para registrar las notificaciones por email enviadas
CREATE TABLE IF NOT EXISTS notificaciones_email (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  tipo VARCHAR(50) NOT NULL, -- 'login', 'registro', 'recuperacion', etc.
  fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_destino VARCHAR(255) NOT NULL,
  contenido TEXT, -- Opcional: guardar el contenido del email
  estado VARCHAR(20) DEFAULT 'enviado', -- 'enviado', 'fallido', etc.
  metadata JSONB -- Datos adicionales que puedan ser útiles
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_notificaciones_email_usuario_id ON notificaciones_email(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_email_tipo ON notificaciones_email(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_email_fecha ON notificaciones_email(fecha_envio);
