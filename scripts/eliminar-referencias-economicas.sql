-- Eliminar referencias a precios en la tabla materiales
ALTER TABLE IF EXISTS materiales DROP COLUMN IF EXISTS precio_estimado;

-- Eliminar referencias a precios en la tabla publicaciones
ALTER TABLE IF EXISTS publicaciones DROP COLUMN IF EXISTS precio;

-- Actualizar la tabla transacciones para eliminar referencias económicas
ALTER TABLE IF EXISTS transacciones DROP COLUMN IF EXISTS precio_total;

-- Actualizar la tabla pedidos para eliminar referencias económicas
ALTER TABLE IF EXISTS pedidos DROP COLUMN IF EXISTS precio_ofrecido;
