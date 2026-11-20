
import { useState } from 'react'

function AlertaCard({ incidente, onActualizarEstado }) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(
    incidente?.estado || 'PENDIENTE'
  )

  const [guardando, setGuardando] = useState(false)
  const [mensajeActualizacion, setMensajeActualizacion] = useState('')
  const [errorActualizacion, setErrorActualizacion] = useState('')

  if (!incidente) {
    return null
  }

  const estado = incidente.estado || 'SIN ESTADO'
  const claseEstado = estado.toLowerCase()

  function verDetalle() {
    setMostrarDetalles(!mostrarDetalles)
  }

  async function guardarEstado() {
    setGuardando(true)
    setMensajeActualizacion('')
    setErrorActualizacion('')

    try {
      await onActualizarEstado(incidente, estadoSeleccionado)

      setMensajeActualizacion(
        'El estado del incidente se actualizó correctamente.'
      )
    } catch (error) {
      console.error('Error al actualizar el incidente:', error)

      setEstadoSeleccionado(incidente.estado || 'PENDIENTE')

      setErrorActualizacion(
        'No fue posible actualizar el incidente. Inténtalo nuevamente.'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <article className="card-incidente">
      <div className="card-incidente-superior">
        <span className={`estado-incidente ${claseEstado}`}>
          {estado.replace('_', ' ')}
        </span>

        <span className="tipo-incidente">
          {incidente.tipoIncidente}
        </span>
      </div>

      <h3>{incidente.titulo}</h3>

      <p className="descripcion-incidente">
        {incidente.descripcion}
      </p>

      <div className="datos-incidente">
        <p>
          <strong>Origen:</strong> {incidente.origen}
        </p>

        <p>
          <strong>Fecha:</strong>{' '}
          {incidente.fechaRegistro
            ? new Date(incidente.fechaRegistro).toLocaleString('es-CO')
            : 'No disponible'}
        </p>

        <p>
          <strong>Usuario:</strong>{' '}
          {incidente.nombreUsuario || 'Sin usuario asociado'}
        </p>
      </div>

      <button
        type="button"
        className="boton-detalle"
        onClick={verDetalle}
        aria-expanded={mostrarDetalles}
      >
        {mostrarDetalles ? 'Ocultar detalles' : 'Ver detalles'}
      </button>

      {mostrarDetalles && (
        <div className="detalles-adicionales">
          <h4>Información adicional</h4>

          <p>
            <strong>ID del incidente:</strong>{' '}
            {incidente.idIncidente}
          </p>

          <p>
            <strong>ID del usuario:</strong>{' '}
            {incidente.idUsuario || 'Sin usuario asociado'}
          </p>

          <p>
            <strong>Correo del usuario:</strong>{' '}
            {incidente.correoUsuario || 'No disponible'}
          </p>
        </div>
      )}

      <div className="campo-formulario">
        <label htmlFor={`estado-${incidente.idIncidente}`}>
          Actualizar estado del incidente
        </label>

        <select
          id={`estado-${incidente.idIncidente}`}
          value={estadoSeleccionado}
          onChange={(evento) => {
            setEstadoSeleccionado(evento.target.value)
            setMensajeActualizacion('')
            setErrorActualizacion('')
          }}
          disabled={guardando}
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_REVISION">En revisión</option>
          <option value="RESUELTO">Resuelto</option>
        </select>
      </div>

      <button
        type="button"
        className="boton-detalle"
        onClick={guardarEstado}
        disabled={guardando || estadoSeleccionado === estado}
      >
        {guardando ? 'Guardando...' : 'Guardar estado'}
      </button>

      {mensajeActualizacion && (
        <p className="mensaje-exito" role="status">
          {mensajeActualizacion}
        </p>
      )}

      {errorActualizacion && (
        <p className="mensaje-error" role="alert">
          {errorActualizacion}
        </p>
      )}
    </article>
  )
}

export default AlertaCard
