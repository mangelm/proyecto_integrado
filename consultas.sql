# Estadísticas de ocupación
SELECT e.espacio, e.horario, COUNT(*) AS total_eventos
FROM evento e
WHERE e.fecha BETWEEN '2025-03-01' AND '2025-03-31'
GROUP BY e.espacio, e.horario
ORDER BY total_eventos DESC;

#Consumo de productos
-- Productos más consumidos
SELECT p.nombre, SUM(cp.cantidad) as total_consumido
FROM consumo_producto cp
JOIN producto p ON cp.producto_id = p.id
JOIN evento e ON cp.evento_id = e.id
WHERE e.fecha BETWEEN '2025-03-01' AND '2025-03-31'
GROUP BY p.id, p.nombre
ORDER BY total_consumido DESC;

-- Productos más consumidos por horario
SELECT p.nombre, e.horario, SUM(cp.cantidad) as total_consumido
FROM consumo_producto cp
JOIN producto p ON cp.producto_id = p.id
JOIN evento e ON cp.evento_id = e.id
WHERE e.fecha BETWEEN '2025-03-01' AND '2025-03-31'
GROUP BY p.id,p.nombre,e.horario
ORDER BY e.horario, total_consumido DESC;