
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function PanelPage() {
  const [incidentes, setIncidentes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarIncidentes = async () => {
      try {
        setCargando(true)
        setError('')

        const respuesta = await api.get('/incidentes')

        setIncidentes(respuesta.data)
      } catch (error) {
        console.error('Error al cargar los incidentes:', error)
        setError('No fue posible cargar el resumen de incidentes.')
      } finally {
        setCargando(false)
      }
    }

    cargarIncidentes()
  }, [])

  const totalIncidentes = incidentes.length

  const incidentesPendientes = incidentes.filter(
    (incidente) => incidente.estado === 'PENDIENTE'
  ).length

  const incidentesEnRevision = incidentes.filter(
    (incidente) => incidente.estado === 'EN_REVISION'
  ).length

  return (
    <main className="panel-principal">

      {/* ESTADO DE SEGURIDAD - PRIMERA SECCIÓN */}

      <section className="panel-estado-seguridad">
        <div className="panel-seccion-encabezado">
          <div>
            <span className="panel-subtitulo">
              INFORMACIÓN DE LA PLATAFORMA
            </span>

            <h2>Estado de seguridad</h2>

            <p>
              Resumen de los incidentes registrados en SoftBecX Shield.
            </p>
          </div>

          <Link to="/alertas" className="panel-enlace-secundario">
            Ver todos los incidentes
          </Link>
        </div>

        <div className="panel-indicadores">
          <article className="panel-indicador panel-indicador-total">
            <div className="panel-indicador-contenido">
              <span className="panel-indicador-titulo">
                Total de incidentes
              </span>

              <strong>
                {cargando ? '...' : totalIncidentes}
              </strong>

              <span className="panel-indicador-descripcion">
                Registros en la plataforma
              </span>
            </div>
          </article>

          <article className="panel-indicador panel-indicador-pendientes">
            <div className="panel-indicador-contenido">
              <span className="panel-indicador-titulo">
                Incidentes pendientes
              </span>

              <strong>
                {cargando ? '...' : incidentesPendientes}
              </strong>

              <span className="panel-indicador-descripcion">
                Requieren atención
              </span>
            </div>
          </article>

          <article className="panel-indicador panel-indicador-revision">
            <div className="panel-indicador-contenido">
              <span className="panel-indicador-titulo">
                En revisión
              </span>

              <strong>
                {cargando ? '...' : incidentesEnRevision}
              </strong>

              <span className="panel-indicador-descripcion">
                En proceso de análisis
              </span>
            </div>
          </article>
        </div>

        {cargando && (
          <p className="panel-mensaje panel-mensaje-carga">
            Actualizando información de incidentes...
          </p>
        )}

        {error && (
          <p className="panel-mensaje panel-mensaje-error" role="alert">
            {error}
          </p>
        )}
      </section>

      {/* HERRAMIENTAS PRINCIPALES - SEGUNDA SECCIÓN */}

      <section className="panel-accesos">
        <div className="panel-seccion-encabezado">
          <div>
            <span className="panel-subtitulo">
              HERRAMIENTAS PRINCIPALES
            </span>

            <h2>Centro de operaciones</h2>

            <p>
              Accede rápidamente a las funciones de SoftBecX Shield.
            </p>
          </div>
        </div>

        <div className="panel-baldosas">
          <Link
            to="/alertas"
            className="panel-baldosa panel-baldosa-alertas"
          >
            <div className="panel-baldosa-contenido">
              <span className="panel-baldosa-categoria">
                MONITOREO Y CONTROL
              </span>

              <div>
                <h3>Centro de alertas</h3>

                <p>
                  Consulta, analiza y administra los incidentes
                  registrados en la plataforma.
                </p>
              </div>

              <span className="panel-baldosa-enlace">
                Administrar alertas
              </span>
            </div>
          </Link>

          <Link
            to="/reportar"
            className="panel-baldosa panel-baldosa-reporte"
          >
            <div className="panel-baldosa-contenido">
              <span className="panel-baldosa-categoria">
                PREVENCIÓN Y REPORTE
              </span>

              <div>
                <h3>Reportar incidente</h3>

                <p>
                  Registra una actividad sospechosa o un posible
                  fraude digital.
                </p>
              </div>

              <span className="panel-baldosa-enlace">
                Crear reporte
              </span>
            </div>
          </Link>

          <Link
            to="/seguimiento"
            className="panel-baldosa panel-baldosa-seguimiento"
          >
            <div className="panel-baldosa-contenido">
              <span className="panel-baldosa-categoria">
                CONTROL DE PROCESOS
              </span>

              <div>
                <h3>Seguimiento</h3>

                <p>
                  Consulta el avance y el estado de los incidentes
                  que requieren atención.
                </p>
              </div>

              <span className="panel-baldosa-enlace">
                Ver seguimiento
              </span>
            </div>
          </Link>
        </div>
      </section>

    </main>
  )
}

export default PanelPage
