
import { useState, useEffect } from 'react'
import AlertaCard from '../components/AlertaCard'
import api from '../services/api'
import useSeguimiento from '../context/useSeguimiento'

function PanelPage() {
  const {
    idsSeguimiento,
    agregarAlSeguimiento,
    retirarDelSeguimiento
  } = useSeguimiento()

  const [incidentes, setIncidentes] = useState([])
  const [analisisRiesgo, setAnalisisRiesgo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorAnalisis, setErrorAnalisis] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroNivelRiesgo, setFiltroNivelRiesgo] = useState('')

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
            'No fue posible cargar los análisis de riesgo. Los incidentes seguirán disponibles, pero sus niveles y puntajes podrían no mostrarse.'
          )
        }
      } catch (error) {
        console.error('Error al consultar los datos:', error)

        setError(
          'No se pudieron cargar los incidentes. Comprueba que el servidor esté funcionando.'
        )
      } finally {
        setCargando(false)
      }
    }

    obtenerDatos()
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

    setAnalisisRiesgo((listaAnterior) =>
      listaAnterior.filter(
        (analisis) => analisis.idIncidente !== idIncidente
      )
    )

    retirarDelSeguimiento(idIncidente)
  }

  function limpiarFiltros() {
    setFiltroTipo('')
    setFiltroEstado('')
    setFiltroNivelRiesgo('')
  }

  function formatearEtiqueta(valor) {
    return (valor || 'Sin información')
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

  const tiposDisponibles = [
    ...new Set(
      incidentes
        .map((incidente) => incidente.tipoIncidente)
        .filter(Boolean)
    )
  ].sort()

  const estadosDisponibles = [
    ...new Set(
      incidentes
        .map((incidente) => incidente.estado)
        .filter(Boolean)
    )
  ].sort()

  const nivelesRiesgo = ['ALTO', 'MEDIO', 'BAJO']

  const incidentesFiltrados = incidentes.filter((incidente) => {
    const analisis = analisisPorIncidente[incidente.idIncidente]

    const coincideTipo =
      filtroTipo === '' || incidente.tipoIncidente === filtroTipo

    const coincideEstado =
      filtroEstado === '' || incidente.estado === filtroEstado

    const coincideNivelRiesgo =
      filtroNivelRiesgo === '' ||
      analisis?.nivelRiesgo === filtroNivelRiesgo

    return coincideTipo && coincideEstado && coincideNivelRiesgo
  })

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

        {!cargando && !error && errorAnalisis && (
          <p className="mensaje-error" role="status">
            {errorAnalisis}
          </p>
        )}

        {!cargando && !error && incidentes.length === 0 && (
          <p className="mensaje-estado">
            Todavía no hay incidentes registrados.
          </p>
        )}

        {!cargando && !error && incidentes.length > 0 && (
          <>
            <div className="filtros-incidentes">
              <div className="campo-filtro">
                <label htmlFor="filtro-tipo">
                  Filtrar por tipo
                </label>

                <select
                  id="filtro-tipo"
                  value={filtroTipo}
                  onChange={(evento) => setFiltroTipo(evento.target.value)}
                >
                  <option value="">Todos los tipos</option>

                  {tiposDisponibles.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {formatearEtiqueta(tipo)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-filtro">
                <label htmlFor="filtro-estado">
                  Filtrar por estado
                </label>

                <select
                  id="filtro-estado"
                  value={filtroEstado}
                  onChange={(evento) => setFiltroEstado(evento.target.value)}
                >
                  <option value="">Todos los estados</option>

                  {estadosDisponibles.map((estado) => (
                    <option key={estado} value={estado}>
                      {formatearEtiqueta(estado)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-filtro">
                <label htmlFor="filtro-nivel-riesgo">
                  Filtrar por nivel de riesgo
                </label>

                <select
                  id="filtro-nivel-riesgo"
                  value={filtroNivelRiesgo}
                  onChange={(evento) =>
                    setFiltroNivelRiesgo(evento.target.value)
                  }
                >
                  <option value="">Todos los niveles</option>

                  {nivelesRiesgo.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {formatearEtiqueta(nivel)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="boton-limpiar-filtros"
                onClick={limpiarFiltros}
                disabled={
                  !filtroTipo &&
                  !filtroEstado &&
                  !filtroNivelRiesgo
                }
              >
                Limpiar filtros
              </button>
            </div>

            <p className="resultado-filtros">
              Mostrando {incidentesFiltrados.length} de {totalIncidentes} incidentes.
            </p>

            {incidentesFiltrados.length === 0 ? (
              <p className="mensaje-estado">
                No se encontraron incidentes con los filtros seleccionados.
              </p>
            ) : (
              <div className="lista-incidentes" id="alertas">
                {incidentesFiltrados.map((incidente) => (
                  <AlertaCard
                    key={incidente.idIncidente}
                    incidente={incidente}
                    analisisRiesgo={
                      analisisPorIncidente[incidente.idIncidente] || null
                    }
                    onActualizarEstado={actualizarEstado}
                    onEliminarIncidente={eliminarIncidente}
                    onAgregarSeguimiento={agregarAlSeguimiento}
                    enSeguimiento={idsSeguimiento.includes(
                      incidente.idIncidente
                    )}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default PanelPage
