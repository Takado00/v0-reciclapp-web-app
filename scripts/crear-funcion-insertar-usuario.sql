-- Función para insertar usuario con bypass de RLS
CREATE OR REPLACE FUNCTION public.insertar_usuario(datos_usuario JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con los permisos del creador
AS $$
BEGIN
  INSERT INTO public.usuarios 
  SELECT * FROM jsonb_populate_record(null::public.usuarios, datos_usuario);
END;
$$;

-- Otorgar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION public.insertar_usuario TO authenticated;
GRANT EXECUTE ON FUNCTION public.insertar_usuario TO anon;
GRANT EXECUTE ON FUNCTION public.insertar_usuario TO service_role;

-- Comentario para documentar la función
COMMENT ON FUNCTION public.insertar_usuario IS 'Inserta un usuario con bypass de RLS';
