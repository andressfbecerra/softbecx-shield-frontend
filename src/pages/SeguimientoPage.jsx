
import { useEffect, useState } from 'react'
import api from '../services/api'
import './Seguimiento.css'

function SeguimientoPage({
  idsSeguimiento,
  onRetirarSeguimiento,
  onVaciarSeguimiento
}) {
  const [incidentes, setIncidentes] = useState([])
  const [analisisRiesgo, setAnalisisRiesgo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorAnalisis, setErrorAnalisis] = useState('')

  useEffect(() => {
    async function obtenerDatos() {
      try {
        const resultados = await Promise.allSettled([
          api.get('/incidentes'),
          api.get('/analisis-riesgo')
        ])

        const resultadoIncidentes = resultados[0]
        const resultadoAnalisis = resultados[1]

        if (resultadoIncidentes.status === 'fulfilled') {
          setIncidentes(resultadoIncidentes.value.data)
          setError('')
        } else {
          throw resultadoIncidentes.reason
        }

        if (resultadoAnalisis.status === 'fulfilled') {
          setAnalisisRiesgo(resultadoAnalisis.value.data)
          setErrorAnalisis('')
        } else {
          console.error(
            'Error al consultar los análisis de riesgo:',
            resultadoAnalisis.reason
          )

          setErrorAnalisis(
            'No fue posible consultar los análisis de riesgo. Los puntajes no están disponibles.'
          )
        }
      } catch (error) {
        console.error('Error al consultar el seguimiento:', error)

        setError(
          'No se pudieron cargar los incidentes del seguimiento. Comprueba que el servidor esté funcionando.'
        )
      } finally {
        setCargando(false)
      }
    }

    obtenerDatos()
  }, [])

  function formatearEtiqueta(valor) {
    return (valor || 'Sin estado')
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/^./, (letra) => letra.toUpperCase())
      .replace('revision', 'revisión')
  }

  const analisisPorIncidente = {}

  analisisRiesgo.forEach((analisis) => {
    const idIncidente = analisis.idIncidente

    if (idIncidente == null) {
      return
    }

    const analisisActual = analisisPorIncidente[idIncidente]

    if (
      !analisisActual ||
      new Date(analisis.fechaAnalisis || 0) >
        new Date(analisisActual.fechaAnalisis || 0)
    ) {
      analisisPorIncidente[idIncidente] = analisis
    }
  })

  const incidentesEnSeguimiento = incidentes.filter((incidente) =>
    idsSeguimiento.includes(incidente.idIncidente)
  )

  const incidentesAnalizados = incidentesEnSeguimiento.filter(
    (incidente) => analisisPorIncidente[incidente.idIncidente]
  )

  const puntajeAcumulado = incidentesAnalizados.reduce(
    (total, incidente) => {
      const analisis = analisisPorIncidente[incidente.idIncidente]

      return total + Number(analisis.puntajeRiesgo || 0)
    },
    0
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

      {!cargando && !error && (
        <section className="resumen-incidentes">
          <article className="resumen-card">
            <span>Incidentes seleccionados</span>
            <strong>{incidentesEnSeguimiento.length}</strong>
          </article>

          <article className="resumen-card">
            <span>Incidentes analizados</span>
            <strong>
              {errorAnalisis ? '—' : incidentesAnalizados.length}
            </strong>
          </article>

          <article className="resumen-card">
            <span>Puntaje acumulado</span>
            <strong>
              {errorAnalisis
                ? '—'
                : puntajeAcumulado.toLocaleString('es-CO')}
            </strong>
          </article>
        </section>
      )}

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

        {!cargando && !error && errorAnalisis && (
          <p className="mensaje-error" role="status">
            {errorAnalisis}
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
              {incidentesEnSeguimiento.map((incidente) => {
                const analisis =
                  analisisPorIncidente[incidente.idIncidente]

                return (
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
                          ? new Date(
                              incidente.fechaRegistro
                            ).toLocaleString('es-CO')
                          : 'No disponible'}
                      </p>

                      <p>
                        <strong>Nivel de riesgo:</strong>{' '}
                        {errorAnalisis
                          ? 'No disponible'
                          : analisis
                            ? formatearEtiqueta(analisis.nivelRiesgo)
                            : 'Pendiente de análisis'}
                      </p>

                      <p>
                        <strong>Puntaje de riesgo:</strong>{' '}
                        {errorAnalisis
                          ? 'No disponible'
                          : analisis
                            ? `${Number(analisis.puntajeRiesgo).toLocaleString('es-CO')} puntos`
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
                )
              })}
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
