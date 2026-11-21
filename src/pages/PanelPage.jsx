
import { useState, useEffect } from 'react'
import AlertaCard from '../components/AlertaCard'
import api from '../services/api'

function PanelPage() {
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
        console.error('Error al consultar incidentes:', error)

        setError(
          'No se pudieron cargar los incidentes. Comprueba que el servidor esté funcionando.'
        )
      } finally {
        setCargando(false)
      }
    }

    obtenerIncidentes()
  }, [])

  async function actualizarEstado(incidente, nuevoEstado) {
    const datosActualizados = {
      titulo: incidente.titulo,
      descripcion: incidente.descripcion,
      tipoIncidente: incidente.tipoIncidente,
      origen: incidente.origen,
      estado: nuevoEstado,
      usuario: incidente.idUsuario != null
        ? { idUsuario: incidente.idUsuario }
        : null
    }

    const respuesta = await api.put(
      `/incidentes/${incidente.idIncidente}`,
      datosActualizados
    )

    const incidenteActualizado = respuesta.data

    setIncidentes((listaAnterior) =>
      listaAnterior.map((elemento) =>
        elemento.idIncidente === incidenteActualizado.idIncidente
          ? incidenteActualizado
          : elemento
      )
    )

    return incidenteActualizado
  }

  async function eliminarIncidente(idIncidente) {
    await api.delete(`/incidentes/${idIncidente}`)

    setIncidentes((listaAnterior) =>
      listaAnterior.filter(
        (incidente) => incidente.idIncidente !== idIncidente
      )
    )
  }

  const totalIncidentes = incidentes.length

  const incidentesPendientes = incidentes.filter(
    (incidente) => incidente.estado === 'PENDIENTE'
  ).length

  const incidentesEnRevision = incidentes.filter(
    (incidente) => incidente.estado === 'EN_REVISION'
  ).length

  return (
    <main className="panel-principal" id="inicio">
      <section className="bienvenida">
        <p className="texto-superior">CENTRO DE SEGURIDAD DIGITAL</p>

        <h1>Panel de seguridad</h1>

        <p>
          Supervisa y consulta los incidentes registrados en SoftBecX Shield.
        </p>
      </section>

      <section className="resumen-incidentes">
        <article className="resumen-card">
          <span>Total de incidentes</span>
          <strong>{totalIncidentes}</strong>
        </article>

        <article className="resumen-card">
          <span>Pendientes</span>
          <strong>{incidentesPendientes}</strong>
        </article>

        <article className="resumen-card">
          <span>En revisión</span>
          <strong>{incidentesEnRevision}</strong>
        </article>
      </section>

      <section className="seccion-incidentes" id="incidentes">
        <div className="encabezado-seccion">
          <div>
            <h2>Incidentes registrados</h2>
            <p>Información consultada desde la base de datos.</p>
          </div>
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

        {!cargando && !error && incidentes.length === 0 && (
          <p className="mensaje-estado">
            Todavía no hay incidentes registrados.
          </p>
        )}

        {!cargando && !error && incidentes.length > 0 && (
          <div className="lista-incidentes" id="alertas">
            {incidentes.map((incidente) => (
              <AlertaCard
                key={incidente.idIncidente}
                incidente={incidente}
                onActualizarEstado={actualizarEstado}
                onEliminarIncidente={eliminarIncidente}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default PanelPage
