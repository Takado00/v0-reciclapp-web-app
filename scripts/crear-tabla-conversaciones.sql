-- Crear la tabla conversaciones si no existe
CREATE TABLE IF NOT EXISTS conversaciones (
  id UUID PRIMARY KEY,
  usuario1_id UUID REFERENCES auth.users(id),
  usuario2_id UUID REFERENCES auth.users(id),
  ultimo_mensaje TEXT,
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  mensajes_no_leidos INTEGER DEFAULT 0,
  creada_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla mensajes si no existe
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY,
  conversacion_id UUID REFERENCES conversaciones(id),
  emisor_id UUID REFERENCES auth.users(id),
  receptor_id UUID REFERENCES auth.users(id),
  contenido TEXT NOT NULL,
  fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  leido BOOLEAN DEFAULT FALSE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario1 ON conversaciones(usuario1_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario2 ON conversaciones(usuario2_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_emisor ON mensajes(emisor_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_receptor ON mensajes(receptor_id);

-- Crear función para incrementar contadores
CREATE OR REPLACE FUNCTION increment(x integer) RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql;
