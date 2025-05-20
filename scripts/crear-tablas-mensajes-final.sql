-- Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar roles básicos si no existen
INSERT INTO roles (nombre, descripcion)
VALUES 
  ('usuario', 'Usuario regular de la plataforma'),
  ('reciclador', 'Reciclador profesional o informal'),
  ('empresa', 'Empresa de reciclaje o procesamiento de materiales'),
  ('admin', 'Administrador de la plataforma')
ON CONFLICT (nombre) DO NOTHING;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE,
  contrasena VARCHAR(100),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  foto_perfil TEXT,
  rol_id UUID REFERENCES roles(id),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_conexion TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  descripcion TEXT,
  sitio_web VARCHAR(255),
  especialidad VARCHAR(100),
  horario_atencion VARCHAR(100),
  certificaciones TEXT[],
  materiales_aceptados TEXT[],
  redes_sociales JSONB,
  intereses_reciclaje TEXT[],
  nivel_experiencia VARCHAR(50),
  biografia TEXT,
  educacion TEXT,
  anos_experiencia INTEGER,
  areas_servicio TEXT[]
);

-- Crear tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  otro_usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  ultimo_mensaje TEXT,
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  no_leidos INTEGER DEFAULT 0,
  UNIQUE(usuario_id, otro_usuario_id)
);

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversacion_id UUID REFERENCES conversaciones(id) ON DELETE CASCADE,
  emisor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  receptor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  leido BOOLEAN DEFAULT FALSE
);

-- Crear función para incrementar contador
CREATE OR REPLACE FUNCTION increment(x integer) RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

-- Crear usuarios de ejemplo si no existen
DO $$
DECLARE
  reciclador_rol_id UUID;
  empresa_rol_id UUID;
BEGIN
  -- Obtener IDs de roles
  SELECT id INTO reciclador_rol_id FROM roles WHERE nombre = 'reciclador';
  SELECT id INTO empresa_rol_id FROM roles WHERE nombre = 'empresa';
  
  -- Insertar usuarios de ejemplo
  INSERT INTO usuarios (nombre, correo, contrasena, telefono, rol_id, foto_perfil, descripcion)
  VALUES 
    ('Juan Pérez - Reciclador', 'juan.perez@reciclapp.com', 'password_hash_ejemplo', '+57 300 123 4567', reciclador_rol_id, '/placeholder.svg?height=200&width=200&query=recycler1', 'Reciclador con 5 años de experiencia especializado en plásticos y papel.'),
    ('EcoRecicla S.A.', 'contacto@ecorecicla.com', 'password_hash_ejemplo', '+57 601 987 6543', empresa_rol_id, '/placeholder.svg?height=200&width=200&query=recycling_company1', 'Empresa dedicada al procesamiento de materiales reciclables desde 2010.'),
    ('María González - Recicladora', 'maria.gonzalez@reciclapp.com', 'password_hash_ejemplo', '+57 310 234 5678', reciclador_rol_id, '/placeholder.svg?height=200&width=200&query=recycler2', 'Especialista en reciclaje de plásticos y papel con certificación ambiental.'),
    ('GreenTech Recycling', 'info@greentech.com', 'password_hash_ejemplo', '+57 602 345 6789', empresa_rol_id, '/placeholder.svg?height=200&width=200&query=recycling_company2', 'Especialistas en el reciclaje de equipos electrónicos y baterías.'),
    ('Carlos Rodríguez - Reciclador', 'carlos.rodriguez@reciclapp.com', 'password_hash_ejemplo', '+57 320 345 6789', reciclador_rol_id, '/placeholder.svg?height=200&width=200&query=recycler3', 'Reciclador de metales y vidrio con 8 años de experiencia.')
  ON CONFLICT (correo) DO NOTHING;
END $$;
