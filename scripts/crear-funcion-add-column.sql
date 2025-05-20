-- Crear función para añadir columna si no existe
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
) RETURNS void AS $$
DECLARE
  column_exists boolean;
BEGIN
  -- Verificar si la columna ya existe
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = add_column_if_not_exists.table_name
    AND column_name = add_column_if_not_exists.column_name
  ) INTO column_exists;
  
  -- Si la columna no existe, añadirla
  IF NOT column_exists THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
                  table_name, column_name, column_type);
  END IF;
END;
$$ LANGUAGE plpgsql;
