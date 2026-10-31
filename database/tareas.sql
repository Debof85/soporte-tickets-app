-- Sprint 6 · Equipo Líder (3.º año)
-- Módulo Tareas: requiere la tabla proyectos (proyectos.sql, Sprint 5).
USE soporte_tickets;

CREATE TABLE IF NOT EXISTS tareas (
    id_tarea INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    prioridad VARCHAR(20) DEFAULT 'Media',
    id_proyecto INT NOT NULL,
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE
);

-- Datos de prueba (opcional)
INSERT INTO tareas (nombre, estado, prioridad, id_proyecto) VALUES
('Diseñar pantalla de clientes', 'Pendiente', 'Alta', 1),
('Crear endpoints de proyectos', 'En desarrollo', 'Media', 1),
('Documentar API', 'Finalizada', 'Baja', 2);
