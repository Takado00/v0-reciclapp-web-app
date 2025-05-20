-- Verificar la estructura actual de la tabla conversaciones
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'conversaciones';
