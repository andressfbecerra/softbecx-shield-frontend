
import { useEffect, useState } from 'react'
import api from '../services/api'
import useSeguimiento from '../context/useSeguimiento'

function FilaIncidente({
  incidente,
  analisisRiesgo,
  recomendaciones,
  onAnalizarIncidente,
  onActualizarEstado,
  onEliminarIncidente,
  onAgregarSeguimiento,
  enSeguimiento,
  mostrarDetalles,
  onToggleDetalles
}) {
  const [seleccionEstado, setSeleccionEstado] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [analizando, setAnalizando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const estado = incidente.estado || 'SIN ESTADO'
  const estadoActual = incidente.estado || 'PENDIENTE'

  const estadoSeleccionado =
    seleccionEstado?.estadoBase === estadoActual
      ? seleccionEstado.valor
      : estadoActual

  useEffect(() => {
    if (!mensaje) {
      return
    }

    const temporizador = window.setTimeout(() => {
      setMensaje('')
    }, 3000)

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

  function formatearFecha(fecha, incluirHora = false) {
    if (!fecha) {
      return 'No disponible'
    }

    return new Date(fecha).toLocaleString(
      'es-CO',
      incluirHora
        ? undefined
        : {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }
    )
  }

  async function analizar() {
    setAnalizando(true)
    setMensaje('')
    setError('')

    try {
      await onAnalizarIncidente(incidente.idIncidente)
      setMensaje('Análisis de riesgo ejecutado correctamente.')
    } catch (error) {
      console.error('Error al analizar el incidente:', error)

      const mensajeServidor = error.response?.data?.mensaje

      setError(
        mensajeServidor ||
        'No fue posible ejecutar el análisis. Inténtalo nuevamente.'
      )
    } finally {
      setAnalizando(false)
    }
  }

  async function guardarEstado() {
    setGuardando(true)
    setMensaje('')
    setError('')

    try {
      await onActualizarEstado(
        incidente,
        estadoSeleccionado
      )

      setMensaje('Estado actualizado correctamente.')
    } catch (error) {
      console.error('Error al actualizar el incidente:', error)

      setSeleccionEstado(null)
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
              disabled={analizando || eliminando}
            >
              {mostrarDetalles ? 'Ocultar' : 'Detalles'}
            </button>

            <button
              type="button"
              className="boton-accion boton-analizar"
              onClick={analizar}
              disabled={analizando || eliminando || guardando}
            >
              {analizando ? 'Analizando...' : 'Analizar'}
            </button>

            <button
              type="button"
              className={`boton-accion boton-seguir ${enSeguimiento ? 'accion-agregada' : ''}`}
              onClick={() => onAgregarSeguimiento(incidente.idIncidente)}
              disabled={enSeguimiento || guardando || eliminando || analizando}
            >
              {enSeguimiento ? 'En seguimiento' : 'Seguir'}
            </button>

            <button
              type="button"
              className="boton-accion boton-eliminar"
              onClick={eliminar}
              disabled={guardando || eliminando || analizando}
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
              <section className="seccion-tabla-detalle">
                <h3>Información del incidente</h3>

                <table className="tabla-detalle">
                  <thead>
                    <tr>
                      <th>Campo</th>
                      <th>Información</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>ID del incidente</td>
                      <td>{incidente.idIncidente}</td>
                    </tr>

                    <tr>
                      <td>Título</td>
                      <td>{incidente.titulo || 'No disponible'}</td>
                    </tr>

                    <tr>
                      <td>Descripción</td>
                      <td>{incidente.descripcion || 'No disponible'}</td>
                    </tr>

                    <tr>
                      <td>Tipo de incidente</td>
                      <td>{formatearEtiqueta(incidente.tipoIncidente)}</td>
                    </tr>

                    <tr>
                      <td>Origen</td>
                      <td>{incidente.origen || 'No disponible'}</td>
                    </tr>

                    <tr>
                      <td>Estado</td>
                      <td>{formatearEtiqueta(incidente.estado)}</td>
                    </tr>

                    <tr>
                      <td>Usuario</td>
                      <td>{incidente.nombreUsuario || 'Sin usuario asociado'}</td>
                    </tr>

                    <tr>
                      <td>ID del usuario</td>
                      <td>{incidente.idUsuario ?? 'Sin usuario asociado'}</td>
                    </tr>

                    <tr>
                      <td>Correo electrónico</td>
                      <td>{incidente.correoUsuario || 'No disponible'}</td>
                    </tr>

                    <tr>
                      <td>Fecha de registro</td>
                      <td>{formatearFecha(incidente.fechaRegistro, true)}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="seccion-tabla-detalle">
                <h3>Información del análisis de riesgo</h3>

                {analisisRiesgo ? (
                  <table className="tabla-detalle">
                    <thead>
                      <tr>
                        <th>Campo</th>
                        <th>Información</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>ID del análisis</td>
                        <td>{analisisRiesgo.idAnalisis ?? 'No disponible'}</td>
                      </tr>

                      <tr>
                        <td>Método de análisis</td>
                        <td>{analisisRiesgo.metodoAnalisis || 'No disponible'}</td>
                      </tr>

                      <tr>
                        <td>Nivel de riesgo</td>
                        <td>{formatearEtiqueta(analisisRiesgo.nivelRiesgo)}</td>
                      </tr>

                      <tr>
                        <td>Puntaje de riesgo</td>
                        <td>
                          {analisisRiesgo.puntajeRiesgo != null
                            ? `${analisisRiesgo.puntajeRiesgo} puntos`
                            : 'No disponible'}
                        </td>
                      </tr>

                      <tr>
                        <td>Fecha del análisis</td>
                        <td>{formatearFecha(analisisRiesgo.fechaAnalisis, true)}</td>
                      </tr>

                      <tr>
                        <td>Explicación del riesgo</td>
                        <td>
                          {analisisRiesgo.explicacionAnalisis ||
                            analisisRiesgo.explicacion ||
                            'No disponible'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="mensaje-tabla-detalle">
                    Este incidente todavía no tiene un análisis de riesgo disponible.
                  </p>
                )}
              </section>

              <section className="seccion-tabla-detalle">
                <h3>Recomendaciones de seguridad</h3>

                {recomendaciones.length > 0 ? (
                  <table className="tabla-detalle">
                    <thead>
                      <tr>
                        <th>Campo</th>
                        <th>Información</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recomendaciones.map((recomendacion) => (
                        <tr key={recomendacion.idRecomendacion}>
                          <td>
                            <strong>{recomendacion.titulo || 'Recomendación'}</strong>

                            <span className="detalle-prioridad">
                              Prioridad:{' '}
                              {formatearEtiqueta(recomendacion.prioridad)}
                            </span>
                          </td>

                          <td>
                            <p className="descripcion-tabla-recomendacion">
                              {recomendacion.descripcion || 'Sin descripción disponible'}
                            </p>

                            <small className="identificador-recomendacion">
                              Recomendación #{recomendacion.idRecomendacion}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mensaje-tabla-detalle">
                    Este análisis todavía no tiene recomendaciones de seguridad registradas.
                  </p>
                )}
              </section>

              <div className="actualizar-estado-tabla">
                <label htmlFor={`estado-${incidente.idIncidente}`}>
                  Actualizar estado
                </label>

                <select
                  id={`estado-${incidente.idIncidente}`}
                  value={estadoSeleccionado}
                  onChange={(evento) => {
                    setSeleccionEstado({
                      estadoBase: estadoActual,
                      valor: evento.target.value
                    })
                    setMensaje('')
                    setError('')
                  }}
                  disabled={guardando || eliminando || analizando}
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
                    analizando ||
                    estadoSeleccionado === estadoActual
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
  const [recomendaciones, setRecomendaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorAnalisis, setErrorAnalisis] = useState('')
  const [errorRecomendaciones, setErrorRecomendaciones] = useState('')

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
          api.get('/analisis-riesgo'),
          api.get('/recomendaciones')
        ])

        const resultadoIncidentes = resultados[0]
        const resultadoAnalisis = resultados[1]
        const resultadoRecomendaciones = resultados[2]

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

        if (resultadoRecomendaciones.status === 'fulfilled') {
          setRecomendaciones(resultadoRecomendaciones.value.data)
          setErrorRecomendaciones('')
        } else {
          console.error(
            'Error al consultar las recomendaciones:',
            resultadoRecomendaciones.reason
          )

          setErrorRecomendaciones(
            'No fue posible cargar las recomendaciones de seguridad.'
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

  async function analizarIncidente(idIncidente) {
    await api.post(`/analisis-riesgo/incidente/${idIncidente}`)

    const resultados = await Promise.all([
      api.get('/analisis-riesgo'),
      api.get('/recomendaciones')
    ])

    setAnalisisRiesgo(resultados[0].data)
    setRecomendaciones(resultados[1].data)

    setErrorAnalisis('')
    setErrorRecomendaciones('')
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

    const analisisRelacionados = analisisRiesgo.filter(
      (analisis) => analisis.idIncidente === idIncidente
    )

    const idsAnalisisRelacionados = analisisRelacionados.map(
      (analisis) => analisis.idAnalisis
    )

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

    setRecomendaciones((listaAnterior) =>
      listaAnterior.filter(
        (recomendacion) =>
          !idsAnalisisRelacionados.includes(recomendacion.idAnalisis)
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

  const recomendacionesPorAnalisis = {}

  recomendaciones.forEach((recomendacion) => {
    const idAnalisis = recomendacion.idAnalisis

    if (idAnalisis == null) {
      return
    }

    if (!recomendacionesPorAnalisis[idAnalisis]) {
      recomendacionesPorAnalisis[idAnalisis] = []
    }

    recomendacionesPorAnalisis[idAnalisis].push(recomendacion)
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

      {!cargando && !error && errorRecomendaciones && (
        <p className="mensaje-error" role="status">
          {errorRecomendaciones}
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
                  {incidentesFiltrados.map((incidente) => {
                    const analisis =
                      analisisPorIncidente[incidente.idIncidente] || null

                    const recomendacionesDelAnalisis = analisis
                      ? recomendacionesPorAnalisis[analisis.idAnalisis] || []
                      : []

                    return (
                      <FilaIncidente
                        key={incidente.idIncidente}
                        incidente={incidente}
                        analisisRiesgo={analisis}
                        recomendaciones={recomendacionesDelAnalisis}
                        onAnalizarIncidente={analizarIncidente}
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
                    )
                  })}
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
