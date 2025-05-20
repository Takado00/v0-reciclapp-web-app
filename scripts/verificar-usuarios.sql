-- Verificar la estructura de la tabla usuarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios';

-- Verificar si hay usuarios con rol_id = 2 (recicladores)
SELECT id, nombre, rol_id
FROM usuarios
WHERE rol_id = 2;

-- Verificar si hay usuarios con rol_id = 1 (usuarios normales)
SELECT id, nombre, rol_id
FROM usuarios
WHERE rol_id = 1;
