-- Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT
);

-- Insertar roles básicos si no existen
INSERT INTO roles (nombre, descripcion)
VALUES 
  ('admin', 'Administrador del sistema'),
  ('usuario', 'Usuario regular'),
  ('reciclador', 'Recolector de materiales reciclables'),
  ('empresa', 'Empresa compradora de materiales reciclables'),
  ('persona-natural', 'Persona natural que recicla')
ON CONFLICT (nombre) DO NOTHING;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(50),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP WITH TIME ZONE,
  rol_id INTEGER REFERENCES roles(id),
  descripcion TEXT,
  sitio_web VARCHAR(255),
  especialidad VARCHAR(100),
  horario_atencion VARCHAR(255),
  certificaciones TEXT[],
  materiales_aceptados TEXT[],
  foto_perfil VARCHAR(255),
  redes_sociales JSONB,
  intereses_reciclaje TEXT[],
  nivel_experiencia VARCHAR(50),
  biografia TEXT,
  educacion TEXT,
  anos_experiencia INTEGER,
  areas_servicio TEXT[]
);

-- Crear tabla de publicaciones si no existe
CREATE TABLE IF NOT EXISTS publicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  cantidad NUMERIC(10, 2),
  unidad_medida VARCHAR(20),
  precio NUMERIC(10, 2),
  imagen_url VARCHAR(255),
  estado VARCHAR(20) DEFAULT 'disponible',
  fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  material_id INTEGER
);

-- Crear tabla de transacciones si no existe
CREATE TABLE IF NOT EXISTS transacciones (
  id SERIAL PRIMARY KEY,
  publicacion_id INTEGER REFERENCES publicaciones(id) ON DELETE SET NULL,
  comprador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  vendedor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  cantidad NUMERIC(10, 2),
  precio_total NUMERIC(10, 2),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notas TEXT
);

-- Crear tabla de valoraciones si no existe
CREATE TABLE IF NOT EXISTS valoraciones (
  id SERIAL PRIMARY KEY,
  transaccion_id INTEGER REFERENCES transacciones(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_valoracion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de materiales si no existe
CREATE TABLE IF NOT EXISTS materiales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50),
  imagen_url VARCHAR(255),
  precio_estimado NUMERIC(10, 2),
  unidad_medida VARCHAR(20),
  cantidad INTEGER,
  condicion VARCHAR(50)
);

-- Crear tabla de imágenes de materiales si no existe
CREATE TABLE IF NOT EXISTS material_imagenes (
  id SERIAL PRIMARY KEY,
  material_id INTEGER REFERENCES materiales(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  orden INTEGER DEFAULT 0
);

-- Crear tabla de ubicaciones si no existe
CREATE TABLE IF NOT EXISTS ubicaciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL,
  ciudad VARCHAR(50),
  latitud NUMERIC(10, 6),
  longitud NUMERIC(10, 6),
  tipo VARCHAR(50),
  horario VARCHAR(255),
  materiales_aceptados TEXT[],
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  sitio_web VARCHAR(255),
  descripcion TEXT,
  imagen_url VARCHAR(255)
);

-- Crear tabla de mensajes si no existe
CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  emisor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  receptor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  leido BOOLEAN DEFAULT FALSE,
  eliminado_emisor BOOLEAN DEFAULT FALSE,
  eliminado_receptor BOOLEAN DEFAULT FALSE
);

-- Crear tabla de conversaciones si no existe
CREATE TABLE IF NOT EXISTS conversaciones (
  id SERIAL PRIMARY KEY,
  usuario1_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  usuario2_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  ultimo_mensaje_id INTEGER REFERENCES mensajes(id) ON DELETE SET NULL,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario1_id, usuario2_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_publicaciones_usuario_id ON publicaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_comprador_id ON transacciones(comprador_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_vendedor_id ON transacciones(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_valoraciones_usuario_id ON valoraciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_emisor_id ON mensajes(emisor_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_receptor_id ON mensajes(receptor_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario1_id ON conversaciones(usuario1_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario2_id ON conversaciones(usuario2_id);

-- Crear un bucket para almacenar avatares si no existe
-- (Esto no se puede hacer directamente con SQL, se debe hacer a través de la API de Supabase)
