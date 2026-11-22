import { useEffect, useState } from 'react'
import api from '../services/api'
import './Seguimiento.css'

function SeguimientoPage({
  idsSeguimiento,
  onRetirarSeguimiento,
  onVaciarSeguimiento
}) {
  const [incidentes, setIncidentes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function obtenerIncidentes() {
      try {
        const respuesta = await api.get('/incidentes')

        setIncidentes(respuesta.data)
        setError('')
      } catch (error) {
        console.error('Error al consultar el seguimiento:', error)

        setError(
          'No se pudieron cargar los incidentes del seguimiento. Comprueba que el servidor esté funcionando.'
        )
      } finally {
        setCargando(false)
      }
    }

    obtenerIncidentes()
  }, [])

  function formatearEtiqueta(valor) {
    return (valor || 'Sin estado')
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/^./, (letra) => letra.toUpperCase())
      .replace('revision', 'revisión')
  }

  const incidentesEnSeguimiento = incidentes.filter((incidente) =>
    idsSeguimiento.includes(incidente.idIncidente)
  )

  return (
    <main className="panel-principal">
      <section className="bienvenida">
        <p className="texto-superior">GESTIÓN DE SEGURIDAD DIGITAL</p>

        <h1>Seguimiento de incidentes</h1>

        <p>
          Consulta y organiza los incidentes que deseas revisar con mayor atención.
        </p>
      </section>

      <section className="seccion-seguimiento">
        <div className="encabezado-seguimiento">
          <div>
            <h2>Incidentes seleccionados</h2>

            <p>
              Aquí encontrarás los incidentes que agregaste desde el panel.
            </p>
          </div>

          <span className="contador-seguimiento">
            {incidentesEnSeguimiento.length} seleccionados
          </span>
        </div>

        {cargando && (
          <p className="mensaje-estado">
            Cargando incidentes...
          </p>
        )}

        {!cargando && error && (
          <p className="mensaje-error">
            {error}
          </p>
        )}

        {!cargando && !error && incidentesEnSeguimiento.length === 0 && (
          <p className="mensaje-seguimiento-vacio">
            Todavía no tienes incidentes agregados al seguimiento.
            Regresa al panel y selecciona los incidentes que deseas revisar.
          </p>
        )}

        {!cargando && !error && incidentesEnSeguimiento.length > 0 && (
          <>
            <div className="lista-seguimiento">
              {incidentesEnSeguimiento.map((incidente) => (
                <article
                  className="elemento-seguimiento"
                  key={incidente.idIncidente}
                >
                  <div className="informacion-seguimiento">
                    <h3>{incidente.titulo}</h3>

                    <p>
                      <strong>ID:</strong> {incidente.idIncidente}
                    </p>

                    <p>
                      <strong>Tipo:</strong>{' '}
                      {formatearEtiqueta(incidente.tipoIncidente)}
                    </p>

                    <p>
                      <strong>Estado:</strong>{' '}
                      {formatearEtiqueta(incidente.estado)}
                    </p>

                    <p>
                      <strong>Origen:</strong>{' '}
                      {formatearEtiqueta(incidente.origen)}
                    </p>

                    <p>
                      <strong>Descripción:</strong>{' '}
                      {incidente.descripcion}
                    </p>

                    <p>
                      <strong>Fecha de registro:</strong>{' '}
                      {incidente.fechaRegistro
                        ? new Date(incidente.fechaRegistro).toLocaleString('es-CO')
                        : 'No disponible'}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="boton-retirar-seguimiento"
                    onClick={() =>
                      onRetirarSeguimiento(incidente.idIncidente)
                    }
                  >
                    Retirar del seguimiento
                  </button>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="boton-vaciar-seguimiento"
              onClick={onVaciarSeguimiento}
            >
              Vaciar seguimiento
            </button>
          </>
        )}
      </section>
    </main>
  )
}

export default SeguimientoPage