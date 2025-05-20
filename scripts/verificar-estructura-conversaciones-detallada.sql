-- Verificar si la tabla conversaciones existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'conversaciones'
);

-- Obtener la estructura de la tabla conversaciones
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'conversaciones';

-- Verificar si la tabla mensajes existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'mensajes'
);

-- Obtener la estructura de la tabla mensajes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'mensajes';
