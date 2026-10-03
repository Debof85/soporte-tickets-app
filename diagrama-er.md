# Diagrama Entidad-Relación — `soporte_tickets`

Generado a partir de `database/Ticket.sql`. GitHub renderiza este bloque Mermaid automáticamente.

```mermaid
erDiagram
    CLIENTE ||--o{ TICKET : "solicita"
    ESTADO ||--o{ TICKET : "clasifica"
    PERSONAL |o--o{ TICKET : "es asignado a"
    TICKET ||--o{ MENSAJE : "tiene historial"
    PERSONAL ||--o{ MENSAJE : "escribe"

    CLIENTE {
        int id_cliente PK
        varchar nombre "NOT NULL"
        varchar empresa
        varchar telefono
        varchar rubro
        varchar razon_social
        varchar mail
    }
    PERSONAL {
        int id_personal PK
        varchar nombre "NOT NULL"
        varchar apellido "NOT NULL"
        varchar cargo
    }
    ESTADO {
        int id_estado PK
        varchar descripcion "NOT NULL, UNIQUE"
    }
    TICKET {
        int id_ticket PK
        datetime fecha_inicio "NOT NULL"
        datetime fecha_entrega
        enum prioridad "Baja|Media|Alta|Urgente"
        text imagenes
        int id_cliente FK "NOT NULL"
        int id_personal FK "NULL = sin asignar"
        int id_estado FK "NOT NULL"
    }
    MENSAJE {
        int id_mensaje PK
        datetime fecha_mensaje "DEFAULT NOW"
        text descripcion "NOT NULL"
        int id_ticket FK "NOT NULL, ON DELETE CASCADE"
        int id_personal FK "NOT NULL"
    }
```

## Relaciones y cardinalidades

| Relación | Cardinalidad | Por qué (en el SQL) |
|---|---|---|
| cliente → ticket | 1 a 0..N | `ticket.id_cliente NOT NULL`: todo ticket tiene exactamente un cliente |
| estado → ticket | 1 a 0..N | `ticket.id_estado NOT NULL`: todo ticket está en un estado |
| personal → ticket | 0..1 a 0..N | `ticket.id_personal` admite NULL: un ticket puede no tener técnico |
| ticket → mensaje | 1 a 0..N | `ON DELETE CASCADE`: borrar un ticket borra sus mensajes |
| personal → mensaje | 1 a 0..N | `mensaje.id_personal NOT NULL`: todo mensaje tiene autor |
