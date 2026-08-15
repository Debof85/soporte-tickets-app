-- CREATE DATABASE soporte_tickets;
-- USE soporte_tickets;

-- -- 1. Tablas Maestras (Independientes)
-- CREATE TABLE cliente (
--     id_cliente INT AUTO_INCREMENT PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     empresa VARCHAR(100),
--     telefono VARCHAR(30),
--     rubro VARCHAR(100),
--     razon_social VARCHAR(150),
--     mail VARCHAR(150)
-- );

-- CREATE TABLE personal (
--     id_personal INT AUTO_INCREMENT PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     apellido VARCHAR(100) NOT NULL,
--     cargo VARCHAR(100)
-- );

-- CREATE TABLE estado (
--     id_estado INT AUTO_INCREMENT PRIMARY KEY,
--     descripcion VARCHAR(50) NOT NULL UNIQUE
-- );

-- -- Insertamos los estados antes de que los tickets los necesiten
-- INSERT INTO estado (descripcion) VALUES
-- ('Pendiente'),
-- ('En proceso'),
-- ('Retrasado'),
-- ('Finalizado');

-- -- 2. Tabla Ticket (Depende de cliente, personal y estado)
-- CREATE TABLE ticket (
--     id_ticket INT AUTO_INCREMENT PRIMARY KEY,
--     fecha_inicio DATETIME NOT NULL,
--     fecha_entrega DATETIME,
--     prioridad ENUM('Baja','Media','Alta','Urgente') DEFAULT 'Media',
--     imagenes TEXT,
--     id_cliente INT NOT NULL,
--     id_personal INT,
--     id_estado INT NOT NULL,
--     FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
--     FOREIGN KEY (id_personal) REFERENCES personal(id_personal),
--     FOREIGN KEY (id_estado) REFERENCES estado(id_estado)
-- );

-- -- 3. Tabla Mensaje (Depende de ticket y personal)
-- CREATE TABLE mensaje (
--     id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
--     fecha_mensaje DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     descripcion TEXT NOT NULL,
--     id_ticket INT NOT NULL,
--     id_personal INT NOT NULL,
--     FOREIGN KEY (id_ticket) REFERENCES ticket(id_ticket) ON DELETE CASCADE,
--     FOREIGN KEY (id_personal) REFERENCES personal(id_personal)
-- );

-- -- 4. Índices (Opcionales para mejorar rendimiento)
-- CREATE INDEX idx_ticket_cliente ON ticket(id_cliente);
-- CREATE INDEX idx_ticket_estado ON ticket(id_estado);
-- CREATE INDEX idx_ticket_personal ON ticket(id_personal);
-- CREATE INDEX idx_mensaje_ticket ON mensaje(id_ticket);
-- USE soporte_tickets;

-- 1. Insertar Personal / TÉCNICOS
-- INSERT INTO personal (nombre, apellido, cargo) VALUES
-- ('Carlos', 'Gómez', 'Técnico de Soporte L1'),
-- ('Ana', 'Martínez', 'Especialista en Infraestructura'),
-- ('Roberto', 'Fernández', 'Administrador de Sistemas'),
-- ('Lucía', 'Ríos', 'Soporte Técnico L2');

-- 2. Insertar CLIENTES
-- INSERT INTO cliente (nombre, empresa, telefono, rubro, razon_social, mail) VALUES
-- ('Juan Pérez', 'Tech Solutions', '+54 362 4111222', 'Tecnología', 'Tech Solutions S.A.', 'jperez@techsolutions.com'),
-- ('María López', 'Panadería La Central', '+54 362 4333444', 'Gastronomía', 'María López E.I.R.L.', 'contacto@lacentral.com'),
-- ('Estudio Contable Silva', 'Silva & Asociados', '+54 362 4555666', 'Servicios Finacieros', 'Silva Consultores S.R.L.', 'admin@silvaconsultores.com'),
-- ('Gonzalo Benítez', 'Transportes El Rápido', '+54 362 4777888', 'Logística', 'El Rápido Transportes S.A.', 'gbenitez@elrapido.com');

-- 3. Insertar TICKETS
-- Recordatorio de IDs de Estado: 1=Pendiente, 2=En proceso, 3=Retrasado, 4=Finalizado
-- INSERT INTO ticket (fecha_inicio, fecha_entrega, prioridad, imagenes, id_cliente, id_personal, id_estado) VALUES
-- Ticket 1: Finalizado
-- ('2026-08-01 09:00:00', '2026-08-01 11:30:00', 'Baja', 'http://img.local/t1_error.png', 1, 1, 4),
-- Ticket 2: En proceso
-- ('2026-08-10 14:15:00', NULL, 'Alta', 'http://img.local/t2_servidor.jpg', 2, 2, 2),
-- Ticket 3: Retrasado
-- ('2026-08-05 08:30:00', NULL, 'Urgente', NULL, 3, 3, 3),
-- Ticket 4: Pendiente (Aún sin técnico asignado)
-- ('2026-08-15 09:00:00', NULL, 'Media', NULL, 4, NULL, 1);

-- 4. Insertar MENSAJES (Seguimiento e historial)
-- INSERT INTO mensaje (fecha_mensaje, descripcion, id_ticket, id_personal) VALUES
-- Seguimiento del Ticket 1
-- ('2026-08-01 09:15:00', 'Se toma contacto con el cliente para verificar fallo en impresora.', 1, 1),
-- ('2026-08-01 11:30:00', 'Se reinstalaron controladores. Equipo probado y funcionando.', 1, 1),

-- Seguimiento del Ticket 2
-- ('2026-08-10 14:30:00', 'Revisando logs del servidor web que reporta caídas intermitentes.', 2, 2),
-- ('2026-08-10 16:00:00', 'Se detectó saturación en el disco principal. Limpiando archivos temporales.', 2, 2),

-- Seguimiento del Ticket 3
-- ('2026-08-05 09:00:00', 'Evaluando falla en el switch principal de la oficina.', 3, 3),
-- ('2026-08-07 10:00:00', 'Se requiere compra de repuesto. El ticket pasa a estado retrasado.', 3, 3);
SELECT 
    t.id_ticket,
    t.fecha_inicio,
    t.prioridad,
    c.nombre AS cliente,
    c.empresa,
    IFNULL(CONCAT(p.nombre, ' ', p.apellido), 'Sin asignar') AS tecnico_asignado,
    e.descripcion AS estado
FROM ticket t
JOIN cliente c ON t.id_cliente = c.id_cliente
JOIN estado e ON t.id_estado = e.id_estado
LEFT JOIN personal p ON t.id_personal = p.id_personal;


-- SELECT 
--     m.fecha_mensaje,
--     CONCAT(p.nombre, ' ', p.apellido) AS autor,
--     m.descripcion
-- FROM mensaje m
-- JOIN personal p ON m.id_personal = p.id_personal
-- WHERE m.id_ticket = 2
-- ORDER BY m.fecha_mensaje ASC;
-- SELECT
--     t.id_ticket,
--     p.nombre,
--     p.apellido,
--     p.cargo,
--     e.descripcion AS nombre_estado -- Cambiado aquí
-- FROM ticket t
-- INNER JOIN personal p
--     ON t.id_personal = p.id_personal
-- INNER JOIN estado e
--     ON t.id_estado = e.id_estado;
-- SELECT
--     c.nombre AS cliente,
--     t.id_ticket,
--     CONCAT(p.nombre, ' ', p.apellido) AS tecnico,
--     p.cargo,
--     e.descripcion AS nombre_estado -- Corregido aquí
-- FROM ticket t
-- INNER JOIN cliente c -- Corregido a minúsculas
--     ON t.id_cliente = c.id_cliente
-- INNER JOIN personal p
--     ON t.id_personal = p.id_personal
-- INNER JOIN estado e
--     ON t.id_estado = e.id_estado;

-- SELECT
--     c.nombre AS cliente,
--     t.id_ticket,
--     CONCAT(p.nombre, ' ', p.apellido) AS tecnico,
--     e.descripcion AS nombre_estado
-- FROM ticket t
-- INNER JOIN cliente c
--     ON t.id_cliente = c.id_cliente
-- LEFT JOIN personal p -- Usamos LEFT JOIN por si el ticket no tiene técnico asignado aún
--     ON t.id_personal = p.id_personal
-- INNER JOIN estado e
--     ON t.id_estado = e.id_estado
-- WHERE c.nombre LIKE '%TextoAbuscar%'  -- Filtro para buscar por nombre de cliente
--    OR t.id_ticket = 1;              -- Filtro para buscar por número de ticket exacto
-- SELECT 

