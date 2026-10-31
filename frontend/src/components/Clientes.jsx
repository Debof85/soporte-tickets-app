import { useEffect, useState } from 'react';

// La URL de la API se configura con la variable VITE_API_URL (archivo frontend/.env, ver .env.example).
// Si no está definida, se usa la API local por defecto.
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/clientes`;
const FORMULARIO_VACIO = { nombre: '', mail: '', telefono: '' };
const MENSAJE_SIN_CONEXION =
  'No se pudo conectar con el servidor. Verificá que el backend esté encendido en http://localhost:3000';

// fetch() lanza un TypeError cuando no hay conexión con la API (por ejemplo, el backend está apagado).
function textoDeError(error) {
  return error instanceof TypeError ? MENSAJE_SIN_CONEXION : error.message;
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  async function cargarClientes() {
    setCargando(true);
    try {
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error('Error al consultar clientes');
      }
      setClientes(await respuesta.json());
    } catch (error) {
      setMensaje({ tipo: 'error', texto: textoDeError(error) });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!form.nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es obligatorio' });
      return;
    }
    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo registrar el cliente');
      }
      setMensaje({ tipo: 'ok', texto: `Cliente registrado con ID ${datos.id_cliente}` });
      setForm(FORMULARIO_VACIO);
      await cargarClientes();
    } catch (error) {
      setMensaje({ tipo: 'error', texto: textoDeError(error) });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="tarjeta">
      <h2>Gestión de Clientes</h2>

      <form className="formulario" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={handleChange} />
        </label>
        <label>
          Email
          <input type="email" name="mail" value={form.mail} onChange={handleChange} />
        </label>
        <label>
          Teléfono
          <input name="telefono" value={form.telefono} onChange={handleChange} />
        </label>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {mensaje.texto && <p className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>{mensaje.texto}</p>}

      <h3>Listado</h3>
      {cargando ? (
        <p>Cargando clientes...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.mail}</td>
                <td>{cliente.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Clientes;
