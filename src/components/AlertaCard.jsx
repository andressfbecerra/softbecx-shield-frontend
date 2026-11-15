
function AlertaCard({ nombre, descripcion, nivelRiesgo }) {
  if (!nombre || !descripcion || !nivelRiesgo) {
    return null
  }

  function verDetalle() {
    console.log('Alerta seleccionada:', nombre)
  }

  return (
    <>
      <article className="card">
        <span className="bagge">{nivelRiesgo}</span>

        <h2>{nombre}</h2>

        <p>{descripcion}</p>

        <p>
          {nivelRiesgo === 'Riesgo alto'
            ? 'Esta alerta requiere atención inmediata.'
            : 'Esta alerta requiere seguimiento.'}
        </p>

        <button type="button" onClick={verDetalle}>
          Ver más
        </button>
      </article>
    </>
  )
}

export default AlertaCard
