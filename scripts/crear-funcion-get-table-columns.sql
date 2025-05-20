-- Función para obtener las columnas de una tabla
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (column_name text, data_type text) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text
  FROM 
    information_schema.columns c
  WHERE 
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$;
