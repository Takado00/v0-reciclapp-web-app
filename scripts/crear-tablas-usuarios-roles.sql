-- Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles básicos si no existen
INSERT INTO roles (nombre, descripcion)
SELECT 'usuario', 'Usuario normal de la plataforma'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'usuario');

INSERT INTO roles (nombre, descripcion)
SELECT 'reciclador', 'Reciclador profesional'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'reciclador');

INSERT INTO roles (nombre, descripcion)
SELECT 'empresa', 'Empresa de reciclaje'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'empresa');

INSERT INTO roles (nombre, descripcion)
SELECT 'admin', 'Administrador de la plataforma'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'admin');

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  contrasena VARCHAR(100) NOT NULL,
  rol_id INTEGER REFERENCES roles(id),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  descripcion TEXT,
  sitio_web VARCHAR(255),
  foto_perfil VARCHAR(255),
  redes_sociales JSONB,
  intereses_reciclaje TEXT[],
  certificaciones TEXT[],
  materiales_aceptados TEXT[],
  horario_atencion TEXT,
  especialidad VARCHAR(100),
  nivel_experiencia VARCHAR(50),
  biografia TEXT,
  educacion TEXT,
  anos_experiencia INTEGER,
  areas_servicio TEXT[]
);

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas correctamente' AS mensaje;
