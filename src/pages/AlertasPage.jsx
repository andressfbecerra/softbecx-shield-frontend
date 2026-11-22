
import { useEffect, useState } from 'react'
import api from '../services/api'
import useSeguimiento from '../context/useSeguimiento'

function FilaIncidente({
  incidente,
  analisisRiesgo,
  onActualizarEstado,
  onEliminarIncidente,
  onAgregarSeguimiento,
  enSeguimiento,
  mostrarDetalles,
  onToggleDetalles
}) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(
    incidente.estado || 'PENDIENTE'
  )
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const estado = incidente.estado || 'SIN ESTADO'

  useEffect(() => {
    if (!mensaje) {
      return
    }

    const temporizador = window.setTimeout(() => {
      setMensaje('')
    }, 1000)

    return () => {
      window.clearTimeout(temporizador)
    }
  }, [mensaje])

  function formatearEtiqueta(valor) {
    return (valor || 'Sin información')
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/^./, (letra) => letra.toUpperCase())
      .replace('revision', 'revisión')
  }

  async function guardarEstado() {
    setGuardando(true)
    setMensaje('')
    setError('')

    try {
      const incidenteActualizado = await onActualizarEstado(
        incidente,
        estadoSeleccionado
      )

      setEstadoSeleccionado(
        incidenteActualizado?.estado || estadoSeleccionado
      )

      setMensaje('Estado actualizado correctamente.')
    } catch (error) {
      console.error('Error al actualizar el incidente:', error)

      setEstadoSeleccionado(incidente.estado || 'PENDIENTE')
      setError('No fue posible actualizar el incidente. Inténtalo nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar() {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el incidente "${incidente.titulo}"? Esta acción no se puede deshacer.`
    )

    if (!confirmar) {
      return
    }

    setEliminando(true)
    setError('')

    try {
      await onEliminarIncidente(incidente.idIncidente)
    } catch (error) {
      console.error('Error al eliminar el incidente:', error)

      const mensajeServidor = error.response?.data?.mensaje

      if (error.response?.status === 409 && mensajeServidor) {
        setError(mensajeServidor)
      } else {
        setError('No fue posible eliminar el incidente. Inténtalo nuevamente.')
      }
    } finally {
      setEliminando(false)
    }
  }

  const nivelRiesgo = analisisRiesgo?.nivelRiesgo
  const puntajeRiesgo = analisisRiesgo?.puntajeRiesgo

  return (
    <>
      <tr>
        <td>{incidente.idIncidente}</td>

        <td className="celda-incidente">
          <strong>{incidente.titulo}</strong>
          <span>{incidente.descripcion}</span>
        </td>

        <td>{formatearEtiqueta(incidente.tipoIncidente)}</td>

        <td>
          {nivelRiesgo ? (
            <span className={`etiqueta-riesgo ${nivelRiesgo.toLowerCase()}`}>
              {formatearEtiqueta(nivelRiesgo)}
            </span>
          ) : (
            'Pendiente de análisis'
          )}

          {puntajeRiesgo != null && (
            <small className="puntaje-riesgo">
              {Number(puntajeRiesgo).toLocaleString('es-CO')} puntos
            </small>
          )}
        </td>

        <td>
          <span className={`etiqueta-estado ${estado.toLowerCase()}`}>
            {formatearEtiqueta(estado)}
          </span>
        </td>

        <td>
          {incidente.fechaRegistro
            ? new Date(incidente.fechaRegistro).toLocaleDateString('es-CO')
            : 'No disponible'}
        </td>

        <td>
          <div className="acciones-tabla">
            <button
              type="button"
              className="boton-accion boton-detalles-tabla"
              onClick={() => onToggleDetalles(incidente.idIncidente)}
              aria-expanded={mostrarDetalles}
            >
              {mostrarDetalles ? 'Ocultar' : 'Detalles'}
            </button>

            <button
              type="button"
              className={`boton-accion boton-seguir ${enSeguimiento ? 'accion-agregada' : ''}`}
              onClick={() => onAgregarSeguimiento(incidente.idIncidente)}
              disabled={enSeguimiento || guardando || eliminando}
            >
              {enSeguimiento ? 'En seguimiento' : 'Seguir'}
            </button>

            <button
              type="button"
              className="boton-accion boton-eliminar"
              onClick={eliminar}
              disabled={guardando || eliminando}
            >
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </td>
      </tr>

      {mostrarDetalles && (
        <tr className="fila-detalles">
          <td colSpan="7">
            <div className="contenido-detalles">
              <h3>Información del incidente</h3>

              <div className="detalles-grid">
                <p>
                  <strong>ID del incidente:</strong>{' '}
                  {incidente.idIncidente}
                </p>

                <p>
                  <strong>Origen:</strong>{' '}
                  {incidente.origen || 'No disponible'}
                </p>

                <p>
                  <strong>Usuario:</strong>{' '}
                  {incidente.nombreUsuario || 'Sin usuario asociado'}
                </p>

                <p>
                  <strong>ID del usuario:</strong>{' '}
                  {incidente.idUsuario || 'Sin usuario asociado'}
                </p>

                <p>
                  <strong>Correo:</strong>{' '}
                  {incidente.correoUsuario || 'No disponible'}
                </p>

                <p>
                  <strong>Fecha de registro:</strong>{' '}
                  {incidente.fechaRegistro
                    ? new Date(incidente.fechaRegistro).toLocaleString('es-CO')
                    : 'No disponible'}
                </p>
              </div>

              {analisisRiesgo && (
                <>
                  <h3>Información del análisis de riesgo</h3>

                  <div className="detalles-grid">
                    <p>
                      <strong>ID del análisis:</strong>{' '}
                      {analisisRiesgo.idAnalisis || 'No disponible'}
                    </p>

                    <p>
                      <strong>Método:</strong>{' '}
                      {analisisRiesgo.metodoAnalisis || 'No disponible'}
                    </p>

                    <p>
                      <strong>Nivel de riesgo:</strong>{' '}
                      {formatearEtiqueta(analisisRiesgo.nivelRiesgo)}
                    </p>

                    <p>
                      <strong>Puntaje:</strong>{' '}
                      {analisisRiesgo.puntajeRiesgo != null
                        ? `${analisisRiesgo.puntajeRiesgo} puntos`
                        : 'No disponible'}
                    </p>

                    <p>
                      <strong>Fecha del análisis:</strong>{' '}
                      {analisisRiesgo.fechaAnalisis
                        ? new Date(analisisRiesgo.fechaAnalisis).toLocaleString('es-CO')
                        : 'No disponible'}
                    </p>
                  </div>

                  <p>
                    <strong>Explicación del riesgo:</strong>{' '}
                    {analisisRiesgo.explicacion || 'No disponible'}
                  </p>
                </>
              )}

              {!analisisRiesgo && (
                <p>
                  Este incidente todavía no tiene un análisis de riesgo disponible.
                </p>
              )}

              <div className="actualizar-estado-tabla">
                <label htmlFor={`estado-${incidente.idIncidente}`}>
                  Actualizar estado
                </label>

                <select
                  id={`estado-${incidente.idIncidente}`}
                  value={estadoSeleccionado}
                  onChange={(evento) => {
                    setEstadoSeleccionado(evento.target.value)
                    setMensaje('')
                    setError('')
                  }}
                  disabled={guardando || eliminando}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_REVISION">En revisión</option>
                  <option value="RESUELTO">Resuelto</option>
                </select>

                <button
                  type="button"
                  className="boton-guardar-estado"
                  onClick={guardarEstado}
                  disabled={
                    guardando ||
                    eliminando ||
                    estadoSeleccionado === estado
                  }
                >
                  {guardando ? 'Guardando...' : 'Guardar estado'}
                </button>
              </div>

              {mensaje && (
                <p className="mensaje-exito" role="status">
                  {mensaje}
                </p>
              )}

              {error && (
                <p className="mensaje-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function AlertasPage() {
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

  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroNivelRiesgo, setFiltroNivelRiesgo] = useState('')

  const [incidenteDetallesAbiertos, setIncidenteDetallesAbiertos] = useState(null)

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

  function alternarDetalles(idIncidente) {
    setIncidenteDetallesAbiertos((idActual) =>
      idActual === idIncidente ? null : idIncidente
    )
  }

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

    setIncidenteDetallesAbiertos((idActual) =>
      idActual === idIncidente ? null : idActual
    )
  }

  function limpiarFiltros() {
    setBusqueda('')
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

    const textoBusqueda = busqueda.trim().toLowerCase()

    const coincideBusqueda =
      textoBusqueda === '' ||
      [
        incidente.idIncidente,
        incidente.titulo,
        incidente.descripcion,
        incidente.tipoIncidente,
        incidente.origen
      ]
        .filter(Boolean)
        .some((valor) =>
          String(valor).toLowerCase().includes(textoBusqueda)
        )

    const coincideTipo =
      filtroTipo === '' || incidente.tipoIncidente === filtroTipo

    const coincideEstado =
      filtroEstado === '' || incidente.estado === filtroEstado

    const coincideNivelRiesgo =
      filtroNivelRiesgo === '' ||
      analisis?.nivelRiesgo === filtroNivelRiesgo

    return (
      coincideBusqueda &&
      coincideTipo &&
      coincideEstado &&
      coincideNivelRiesgo
    )
  })

  const totalIncidentes = incidentes.length

  const filtrosActivos =
    busqueda.trim() !== '' ||
    filtroTipo !== '' ||
    filtroEstado !== '' ||
    filtroNivelRiesgo !== ''

  return (
    <main className="panel-principal pagina-alertas">
      <section className="bienvenida">
        <p className="texto-superior">CENTRO DE SEGURIDAD DIGITAL</p>

        <h1>Gestión de alertas</h1>

        <p>
          Consulta, analiza y administra los incidentes registrados en SoftBecX Shield.
        </p>
      </section>

      {cargando && (
        <p className="mensaje-estado">
          Cargando incidentes...
        </p>
      )}

      {!cargando && error && (
        <p className="mensaje-error" role="alert">
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
          <section className="filtros-incidentes">
            <div className="campo-filtro campo-busqueda">
              <label htmlFor="buscar-incidente">
                Buscar incidente
              </label>

              <input
                id="buscar-incidente"
                type="search"
                placeholder="Buscar por título, descripción, origen o ID..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </div>

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
                Nivel de riesgo
              </label>

              <select
                id="filtro-nivel-riesgo"
                value={filtroNivelRiesgo}
                onChange={(evento) => setFiltroNivelRiesgo(evento.target.value)}
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
              disabled={!filtrosActivos}
            >
              Limpiar filtros
            </button>
          </section>

          <p className="resultado-filtros">
            Mostrando {incidentesFiltrados.length} de {totalIncidentes} incidentes.
          </p>

          {incidentesFiltrados.length === 0 ? (
            <p className="mensaje-estado">
              No se encontraron incidentes con los criterios seleccionados.
            </p>
          ) : (
            <div className="contenedor-tabla-incidentes">
              <table className="tabla-incidentes">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Incidente</th>
                    <th>Tipo</th>
                    <th>Riesgo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {incidentesFiltrados.map((incidente) => (
                    <FilaIncidente
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
                      mostrarDetalles={
                        incidenteDetallesAbiertos === incidente.idIncidente
                      }
                      onToggleDetalles={alternarDetalles}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default AlertasPage
