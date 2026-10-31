-- Sprint 5 · Equipo Líder (3.º año)
-- Módulo Proyectos: se ejecuta sobre la base soporte_tickets ya creada (Ticket.sql).
USE soporte_tickets;

CREATE TABLE IF NOT EXISTS proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(30) NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- Datos de prueba (opcional)
INSERT INTO proyectos (nombre, descripcion, estado, id_cliente) VALUES
('Sistema de Gestión', 'Sistema web para gestión interna', 'En desarrollo', 1),
('Portal de Soporte', 'Portal de atención al cliente', 'Pendiente', 2);
