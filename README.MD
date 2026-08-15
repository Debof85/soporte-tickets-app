# 🎫 Sistema de Gestión de Soporte y Tickets

Sistema web full-stack para la gestión, seguimiento y resolución de tickets de soporte técnico. Permite registrar clientes, asignar personal técnico, gestionar estados de tickets y mantener un historial detallado de mensajes y avances.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React.js / HTML5, CSS3, JavaScript (Alojado en **Vercel**)
- **Backend:** Node.js, Express.js (Alojado en **Render**)
- **Base de Datos:** MySQL 8.0 (Alojado en **Aiven / TiDB Cloud**)
- **Control de Versiones:** Git & GitHub

---

## 🗄️ Estructura de la Base de Datos

El sistema utiliza la base de datos `soporte_tickets` compuesta por las siguientes tablas principales:

- **`cliente`**: Registro de clientes y empresas solicitantes.
- **`personal`**: Datos del equipo técnico de soporte.
- **`estado`**: Catálogo de estados (`Pendiente`, `En proceso`, `Retrasado`, `Finalizado`).
- **`ticket`**: Tabla central que vincula cliente, técnico asignado, prioridad y estado.
- **`mensaje`**: Historial de seguimiento e interacciones por ticket.

> 📁 El script completo con la estructura y los datos de prueba iniciales se encuentra en `database/soporte_tickets.sql`.

-
