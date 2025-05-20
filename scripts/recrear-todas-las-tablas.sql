-- Eliminar tablas existentes si es necesario (en orden inverso de dependencia)
DROP TABLE IF EXISTS mensajes;
DROP TABLE IF EXISTS conversaciones;
DROP TABLE IF EXISTS historial;
DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS valoraciones;
DROP TABLE IF EXISTS transacciones;
DROP TABLE IF EXISTS publicaciones;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS ubicaciones;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion)
VALUES 
  ('usuario', 'Usuario regular de la plataforma'),
  ('reciclador', 'Reciclador profesional o informal'),
  ('empresa', 'Empresa de reciclaje o procesamiento de materiales'),
  ('admin', 'Administrador de la plataforma');

-- Crear tabla de usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE,
  contrasena VARCHAR(100),
  rol_id INTEGER REFERENCES roles(id),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_conexion TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  foto_perfil TEXT
);

-- Crear tabla de materiales
CREATE TABLE materiales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50) NOT NULL,
  imagen_url TEXT,
  precio_estimado NUMERIC(10, 2),
  unidad_medida VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Crear tabla de ubicaciones
CREATE TABLE ubicaciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL,
  latitud NUMERIC(10, 6),
  longitud NUMERIC(10, 6),
  tipo VARCHAR(50),
  horario TEXT,
  telefono VARCHAR(20),
  usuario_id UUID REFERENCES usuarios(id),
  materiales_aceptados TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  descripcion TEXT
);

-- Crear tabla de publicaciones
CREATE TABLE publicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  material_id INTEGER REFERENCES materiales(id),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  cantidad NUMERIC(10, 2),
  unidad_medida VARCHAR(20),
  precio NUMERIC(10, 2),
  ubicacion_id INTEGER REFERENCES ubicaciones(id),
  imagen_url TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE
);

-- Crear tabla de transacciones
CREATE TABLE transacciones (
  id SERIAL PRIMARY KEY,
  publicacion_id INTEGER REFERENCES publicaciones(id),
  comprador_id UUID REFERENCES usuarios(id),
  vendedor_id UUID REFERENCES usuarios(id),
  cantidad NUMERIC(10, 2),
  precio_total NUMERIC(10, 2),
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE
);

-- Crear tabla de pedidos
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  material_id INTEGER REFERENCES materiales(id),
  cantidad NUMERIC(10, 2),
  unidad_medida VARCHAR(20),
  precio_ofrecido NUMERIC(10, 2),
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE
);

-- Crear tabla de valoraciones
CREATE TABLE valoraciones (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  publicacion_id INTEGER REFERENCES publicaciones(id),
  calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_valoracion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de notificaciones
CREATE TABLE notificaciones (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  tipo VARCHAR(50),
  referencia_id INTEGER,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de historial
CREATE TABLE historial (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  accion VARCHAR(50) NOT NULL,
  descripcion TEXT,
  entidad VARCHAR(50),
  entidad_id INTEGER,
  fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de conversaciones
CREATE TABLE conversaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario1_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  usuario2_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  ultimo_mensaje TEXT,
  ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mensajes_no_leidos INTEGER DEFAULT 0,
  UNIQUE(usuario1_id, usuario2_id)
);

-- Crear tabla de mensajes
CREATE TABLE mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversacion_id UUID REFERENCES conversaciones(id) ON DELETE CASCADE,
  emisor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  enviado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  leido BOOLEAN DEFAULT FALSE
);

-- Crear función para incrementar contador
CREATE OR REPLACE FUNCTION increment(x integer) RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

-- Insertar algunos materiales de ejemplo
INSERT INTO materiales (nombre, descripcion, categoria, imagen_url, precio_estimado, unidad_medida)
VALUES 
  ('Papel', 'Papel de oficina, periódicos, revistas', 'Papel', '/placeholder.svg?height=200&width=200&query=paper_recycling', 0.50, 'kg'),
  ('Cartón', 'Cajas, empaques, cartón corrugado', 'Papel', '/placeholder.svg?height=200&width=200&query=cardboard_recycling', 0.30, 'kg'),
  ('Plástico PET', 'Botellas de bebidas, envases', 'Plástico', '/placeholder.svg?height=200&width=200&query=plastic_pet_recycling', 0.80, 'kg'),
  ('Vidrio', 'Botellas, frascos, vidrio transparente', 'Vidrio', '/placeholder.svg?height=200&width=200&query=glass_recycling', 0.20, 'kg'),
  ('Aluminio', 'Latas de bebidas, papel aluminio', 'Metal', '/placeholder.svg?height=200&width=200&query=aluminum_recycling', 1.50, 'kg');

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (id, nombre, correo, contrasena, rol_id, telefono, foto_perfil)
VALUES 
  (uuid_generate_v4(), 'Juan Pérez - Reciclador', 'juan.perez@reciclapp.com', 'password_hash_ejemplo', 2, '+57 300 123 4567', '/placeholder.svg?height=200&width=200&query=recycler1'),
  (uuid_generate_v4(), 'EcoRecicla S.A.', 'contacto@ecorecicla.com', 'password_hash_ejemplo', 3, '+57 601 987 6543', '/placeholder.svg?height=200&width=200&query=recycling_company1'),
  (uuid_generate_v4(), 'María González - Recicladora', 'maria.gonzalez@reciclapp.com', 'password_hash_ejemplo', 2, '+57 310 234 5678', '/placeholder.svg?height=200&width=200&query=recycler2'),
  (uuid_generate_v4(), 'GreenTech Recycling', 'info@greentech.com', 'password_hash_ejemplo', 3, '+57 602 345 6789', '/placeholder.svg?height=200&width=200&query=recycling_company2'),
  (uuid_generate_v4(), 'Carlos Rodríguez - Reciclador', 'carlos.rodriguez@reciclapp.com', 'password_hash_ejemplo', 2, '+57 320 345 6789', '/placeholder.svg?height=200&width=200&query=recycler3');

-- Insertar ubicaciones de ejemplo
INSERT INTO ubicaciones (nombre, direccion, latitud, longitud, tipo, usuario_id, materiales_aceptados, descripcion)
SELECT 
  'Centro de Reciclaje ' || u.nombre,
  'Calle Principal #123, Ciudad',
  4.6097 + (random() * 0.1),
  -74.0817 + (random() * 0.1),
  CASE WHEN r.nombre = 'reciclador' THEN 'punto_recoleccion' ELSE 'centro_reciclaje' END,
  u.id,
  ARRAY['Papel', 'Cartón', 'Plástico PET', 'Vidrio', 'Aluminio'],
  'Centro de reciclaje donde se aceptan diversos materiales reciclables.'
FROM usuarios u
JOIN roles r ON u.rol_id = r.id
WHERE r.nombre IN ('reciclador', 'empresa')
LIMIT 5;
