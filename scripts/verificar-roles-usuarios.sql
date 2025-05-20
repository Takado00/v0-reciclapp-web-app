-- Verificar si existe la tabla roles_usuarios
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'roles_usuarios'
) AS "tabla_roles_usuarios_existe";

-- Verificar la estructura de la tabla usuarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- Verificar si existe la columna rol_id en la tabla usuarios
SELECT EXISTS (
   SELECT FROM information_schema.columns 
   WHERE table_schema = 'public'
   AND table_name = 'usuarios'
   AND column_name = 'rol_id'
) AS "columna_rol_id_existe";

-- Verificar si existe la columna tipo_usuario en la tabla usuarios
SELECT EXISTS (
   SELECT FROM information_schema.columns 
   WHERE table_schema = 'public'
   AND table_name = 'usuarios'
   AND column_name = 'tipo_usuario'
) AS "columna_tipo_usuario_existe";

-- Verificar los roles existentes
SELECT * FROM roles;
