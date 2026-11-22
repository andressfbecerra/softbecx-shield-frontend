
import { useState } from 'react'
import api from '../services/api'

function ReportarIncidentePage() {
  const [formulario, setFormulario] = useState({
    titulo: '',
    tipoIncidente: '',
    descripcion: ''
  })

  const [enviando, setEnviando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')

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
      await api.post('/incidentes', formulario)

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

  return (
    <main className="pagina-reporte" id="reportar">
      <div className="introduccion-reporte">
        <span className="etiqueta-reporte">
          CENTRO DE SEGURIDAD
        </span>

        <h2>Reportar un incidente</h2>

        <p>
          Ayúdanos a identificar posibles amenazas digitales.
        </p>
      </div>

      <section className="tarjeta-reporte">
        <div className="encabezado-formulario">
          <div>
            <h3>Información del incidente</h3>
            <p>Cuanta más información proporciones, más preciso será el análisis y la identificación del incidente.</p>
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
    </main>
  )
}

export default ReportarIncidentePage
