
import { useState, useEffect } from 'react'
import Header from './components/Header'
import AlertaCard from './components/AlertaCard'
import './App.css'

const URL_API = 'http://localhost:8080/api/incidentes'

function App() {
  const [incidentes, setIncidentes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [formulario, setFormulario] = useState({
    titulo: '',
    tipoIncidente: '',
    descripcion: ''
  })

  const [enviando, setEnviando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')

  useEffect(() => {
    async function obtenerIncidentes() {
      try {
        const respuesta = await fetch(URL_API)

        if (!respuesta.ok) {
          throw new Error('No fue posible consultar los incidentes.')
        }

        const datos = await respuesta.json()

        setIncidentes(datos)
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

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })
  }

  async function registrarIncidente(evento) {
    evento.preventDefault()

    setEnviando(true)
    setMensajeExito('')
    setErrorFormulario('')

    try {
      const respuesta = await fetch(URL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
      })

      if (!respuesta.ok) {
        const mensajeServidor = await respuesta.text()

        throw new Error(
          mensajeServidor || 'No fue posible registrar el incidente.'
        )
      }

      const nuevoIncidente = await respuesta.json()

      setIncidentes((incidentesActuales) => [
        ...incidentesActuales,
        nuevoIncidente
      ])

      setFormulario({
        titulo: '',
        tipoIncidente: '',
        descripcion: ''
      })

      setMensajeExito('El incidente se registró correctamente.')
    } catch (error) {
      console.error('Error al registrar el incidente:', error)

      setErrorFormulario(
        'No fue posible registrar el incidente. Comprueba la conexión con el servidor e inténtalo nuevamente.'
      )
    } finally {
      setEnviando(false)
    }
  }

  const totalIncidentes = incidentes.length

  const incidentesPendientes = incidentes.filter(
    (incidente) => incidente.estado === 'PENDIENTE'
  ).length

  const incidentesEnRevision = incidentes.filter(
    (incidente) => incidente.estado === 'EN_REVISION'
  ).length

  return (
    <>
      <Header />

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
                />
              ))}
            </div>
          )}
        </section>

        <section className="pagina-reporte" id="reportar">
          <div className="introduccion-reporte">
            <span className="etiqueta-reporte">
              CENTRO DE SEGURIDAD
            </span>

            <h2>Reportar un incidente</h2>

            <p>
              Ayúdanos a identificar posibles amenazas digitales.
              Completa el formulario con la información del incidente.
            </p>
          </div>

          <section className="tarjeta-reporte">
            <div className="encabezado-formulario">
              <div className="simbolo-reporte" aria-hidden="true">
                !
              </div>

              <div>
                <h3>Información del incidente</h3>
                <p>Completa todos los campos obligatorios.</p>
              </div>
            </div>

            <form
              className="formulario-reporte"
              onSubmit={registrarIncidente}
            >
              <div className="campo-formulario">
                <label htmlFor="titulo">
                  Título del incidente
                </label>

                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ejemplo: Correo sospechoso"
                  value={formulario.titulo}
                  onChange={manejarCambio}
                  maxLength={120}
                  required
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="tipoIncidente">
                  Tipo de incidente
                </label>

                <select
                  id="tipoIncidente"
                  name="tipoIncidente"
                  value={formulario.tipoIncidente}
                  onChange={manejarCambio}
                  required
                >
                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="PHISHING">
                    Correo sospechoso o phishing
                  </option>

                  <option value="URL">
                    Enlace o URL sospechosa
                  </option>

                  <option value="ACCESO">
                    Acceso o actividad inusual
                  </option>

                  <option value="SUPLANTACION">
                    Suplantación de identidad
                  </option>

                  <option value="OTRO">
                    Otro incidente
                  </option>
                </select>
              </div>

              <div className="campo-formulario">
                <label htmlFor="descripcion">
                  Descripción del incidente
                </label>

                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="6"
                  placeholder="Describe qué ocurrió, dónde lo detectaste y qué información consideras importante."
                  value={formulario.descripcion}
                  onChange={manejarCambio}
                  required
                />

                <small>
                  No incluyas contraseñas ni información bancaria confidencial.
                </small>
              </div>

              <button
                className="boton-enviar"
                type="submit"
                disabled={enviando}
              >
                {enviando ? 'Enviando reporte...' : 'Enviar reporte'}
              </button>

              <p className="nota-formulario">
                Todos los campos son obligatorios.
              </p>

              {mensajeExito && (
                <p className="mensaje-exito" role="status">
                  {mensajeExito}
                </p>
              )}

              {errorFormulario && (
                <p className="mensaje-error" role="alert">
                  {errorFormulario}
                </p>
              )}
            </form>
          </section>

          <div className="aviso-seguridad">
            <span aria-hidden="true">!</span>

            <p>
              <strong>Recomendación de seguridad:</strong>{' '}
              nunca compartas contraseñas, códigos de verificación
              ni información bancaria confidencial en tus reportes.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
