
import { useState } from 'react'

function AlertaCard({ incidente }) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  if (!incidente) {
    return null
  }

  const estado = incidente.estado || 'SIN ESTADO'
  const claseEstado = estado.toLowerCase()

  function verDetalle() {
    setMostrarDetalles(!mostrarDetalles)
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
    </article>
  )
}

export default AlertaCard
