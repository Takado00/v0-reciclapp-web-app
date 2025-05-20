-- Verificar la estructura de la tabla mensajes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'mensajes'
ORDER BY ordinal_position;
