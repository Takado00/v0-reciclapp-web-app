-- Script para desactivar temporalmente RLS en la tabla usuarios
-- ADVERTENCIA: Esto reduce la seguridad, úsese solo en desarrollo o con precaución

-- Desactivar RLS para la tabla usuarios
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- Alternativamente, crear una política permisiva para inserción
CREATE POLICY insert_usuarios_policy
ON public.usuarios
FOR INSERT
TO authenticated, anon, service_role
WITH CHECK (true);

-- Asegurar que RLS está habilitado pero con nuestra política permisiva
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
