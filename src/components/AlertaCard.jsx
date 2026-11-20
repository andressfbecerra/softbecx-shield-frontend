
function AlertaCard({ incidente }) {
  if (!incidente) {
    return null
  }

  const estado = incidente.estado || 'SIN ESTADO'

  const claseEstado = estado.toLowerCase()

  function verDetalle() {
    console.log('Incidente seleccionado:', incidente)
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
      >
        Ver detalles
      </button>
    </article>
  )
}

export default AlertaCard
