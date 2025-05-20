-- Verificar la estructura de la tabla usuarios
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios';

-- Verificar la tabla de roles
SELECT * FROM roles;

-- Verificar usuarios existentes con rol de reciclador
SELECT u.id, u.nombre, u.correo, u.rol_id, r.nombre as rol_nombre
FROM usuarios u
LEFT JOIN roles r ON u.rol_id = r.id
WHERE u.rol_id = 2 OR r.nombre = 'reciclador';

-- Verificar si hay alguna restricción que impida la inserción
SELECT conname as constraint_name, 
       pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'usuarios'::regclass;
