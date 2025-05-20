-- Insertar materiales predeterminados si no existen
INSERT INTO materiales (id, nombre, descripcion, categoria, imagen_url, precio_estimado, unidad_medida, cantidad, condicion, created_at)
VALUES 
(1, 'Botellas PET', 'Botellas de plástico PET reciclables, limpias y sin etiquetas.', 'Plástico', '/materiales/botellas-pet.png', 5.50, 'kg', 10, 'Limpio', NOW()),
(2, 'Cartón', 'Cajas de cartón y cartón corrugado en buen estado.', 'Cartón', '/materiales/carton.png', 3.20, 'kg', 15, 'Seco', NOW()),
(3, 'Latas de Aluminio', 'Latas de aluminio compactadas y limpias.', 'Metal', '/materiales/aluminio.png', 12.75, 'kg', 5, 'Limpio', NOW()),
(4, 'Botellas de Vidrio', 'Botellas de vidrio transparente sin tapas ni etiquetas.', 'Vidrio', '/materiales/vidrio.png', 2.80, 'kg', 20, 'Limpio', NOW()),
(5, 'Papel de Oficina', 'Papel blanco de oficina usado por un lado.', 'Papel', '/materiales/papel.png', 4.00, 'kg', 8, 'Usado', NOW()),
(6, 'Residuos Electrónicos', 'Componentes electrónicos pequeños como placas y cables.', 'Electrónico', '/materiales/electronico.png', 15.00, 'kg', 3, 'Usado', NOW()),
(7, 'Textiles', 'Ropa y telas en buen estado para reutilización.', 'Textil', '/materiales/textil.png', 6.50, 'kg', 7, 'Usado', NOW()),
(8, 'Residuos Orgánicos', 'Residuos de cocina y jardín para compostaje.', 'Orgánico', '/materiales/organico.png', 1.20, 'kg', 25, 'Fresco', NOW())
ON CONFLICT (id) DO NOTHING;
