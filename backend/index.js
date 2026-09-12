const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint base
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Gestión de Soporte y Tickets activa' });
});

// ==========================================
// 1. RECURSO: CLIENTES
// ==========================================

// Listar todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cliente');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', detalle: error.message });
  }
});

// Obtener un cliente por ID
app.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar cliente', detalle: error.message });
  }
});

// Registrar nuevo cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nombre, empresa, telefono, rubro, razon_social, mail } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    const sql = `
      INSERT INTO cliente (nombre, empresa, telefono, rubro, razon_social, mail)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [nombre, empresa, telefono, rubro, razon_social, mail]);
    res.status(201).json({ mensaje: 'Cliente registrado', id_cliente: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar cliente', detalle: error.message });
  }
});

// Actualizar datos de un cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, empresa, telefono, rubro, razon_social, mail } = req.body;
    const sql = `
      UPDATE cliente 
      SET nombre = ?, empresa = ?, telefono = ?, rubro = ?, razon_social = ?, mail = ?
      WHERE id_cliente = ?
    `;
    const [result] = await db.query(sql, [nombre, empresa, telefono, rubro, razon_social, mail, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json({ mensaje: 'Cliente actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente', detalle: error.message });
  }
});

// Eliminar un cliente
app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente', detalle: error.message });
  }
});

// ==========================================
// 2. RECURSO: TICKETS
// ==========================================

// Listar tickets detallados (con JOIN a cliente, estado y personal)
app.get('/tickets', async (req, res) => {
  try {
    const sql = `
      SELECT 
        t.id_ticket,
        t.fecha_inicio,
        t.fecha_entrega,
        t.prioridad,
        t.imagenes,
        c.id_cliente,
        c.nombre AS cliente,
        c.empresa,
        e.id_estado,
        e.descripcion AS estado,
        p.id_personal,
        IFNULL(CONCAT(p.nombre, ' ', p.apellido), 'Sin asignar') AS tecnico_asignado
      FROM ticket t
      JOIN cliente c ON t.id_cliente = c.id_cliente
      JOIN estado e ON t.id_estado = e.id_estado
      LEFT JOIN personal p ON t.id_personal = p.id_personal
      ORDER BY t.id_ticket DESC
    `;
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar tickets', detalle: error.message });
  }
});

// Obtener un ticket específico por ID
app.get('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        t.id_ticket,
        t.fecha_inicio,
        t.fecha_entrega,
        t.prioridad,
        t.imagenes,
        c.nombre AS cliente,
        c.empresa,
        e.descripcion AS estado,
        IFNULL(CONCAT(p.nombre, ' ', p.apellido), 'Sin asignar') AS tecnico_asignado
      FROM ticket t
      JOIN cliente c ON t.id_cliente = c.id_cliente
      JOIN estado e ON t.id_estado = e.id_estado
      LEFT JOIN personal p ON t.id_personal = p.id_personal
      WHERE t.id_ticket = ?
    `;
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el ticket', detalle: error.message });
  }
});

// Registrar un nuevo ticket
app.post('/tickets', async (req, res) => {
  try {
    const { fecha_inicio, fecha_entrega, prioridad, imagenes, id_cliente, id_personal, id_estado } = req.body;
    
    if (!id_cliente || !id_estado) {
      return res.status(400).json({ error: 'Los campos id_cliente e id_estado son obligatorios' });
    }

    const sql = `
      INSERT INTO ticket (fecha_inicio, fecha_entrega, prioridad, imagenes, id_cliente, id_personal, id_estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      fecha_inicio || new Date(),
      fecha_entrega || null,
      prioridad || 'Media',
      imagenes || null,
      id_cliente,
      id_personal || null,
      id_estado
    ]);

    res.status(201).json({ mensaje: 'Ticket creado con éxito', id_ticket: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el ticket', detalle: error.message });
  }
});

// Actualizar ticket (modificar estado, técnico asignado o fechas)
app.put('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_entrega, prioridad, imagenes, id_personal, id_estado } = req.body;
    
    const sql = `
      UPDATE ticket 
      SET fecha_entrega = ?, prioridad = ?, imagenes = ?, id_personal = ?, id_estado = ?
      WHERE id_ticket = ?
    `;
    const [result] = await db.query(sql, [fecha_entrega, prioridad, imagenes, id_personal, id_estado, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    res.status(200).json({ mensaje: 'Ticket actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ticket', detalle: error.message });
  }
});

// Eliminar ticket
app.delete('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM ticket WHERE id_ticket = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    res.status(200).json({ mensaje: 'Ticket eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ticket', detalle: error.message });
  }
});

// ==========================================
// 3. RECURSO: MENSAJES / SEGUIMIENTO
// ==========================================

// Obtener el historial de mensajes de un ticket específico
app.get('/tickets/:id/mensajes', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        m.id_mensaje,
        m.fecha_mensaje,
        m.descripcion,
        CONCAT(p.nombre, ' ', p.apellido) AS autor,
        p.cargo
      FROM mensaje m
      JOIN personal p ON m.id_personal = p.id_personal
      WHERE m.id_ticket = ?
      ORDER BY m.fecha_mensaje ASC
    `;
    const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes', detalle: error.message });
  }
});

// Agregar mensaje de seguimiento a un ticket
app.post('/tickets/:id/mensajes', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, id_personal } = req.body;

    if (!descripcion || !id_personal) {
      return res.status(400).json({ error: 'descripcion e id_personal son obligatorios' });
    }

    const sql = `
      INSERT INTO mensaje (descripcion, id_ticket, id_personal)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [descripcion, id, id_personal]);
    res.status(201).json({ mensaje: 'Mensaje agregado', id_mensaje: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar mensaje', detalle: error.message });
  }
});

// ==========================================
// 4. RECURSOS AUXILIARES: PERSONAL Y ESTADOS
// ==========================================

// Listar técnicos/personal
app.get('/personal', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM personal');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar personal', detalle: error.message });
  }
});

// Listar catálogo de estados
app.get('/estados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estado');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar estados', detalle: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});