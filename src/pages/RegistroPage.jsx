
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Registro.css'

function RegistroPage() {
  const [datos, setDatos] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    documento: '',
    empresa: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
    aceptarTerminos: false
  })

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')

  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target

    setDatos((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: type === 'checkbox' ? checked : value
    }))

    setMensaje('')
    setTipoMensaje('')
  }

  function registrarUsuario(evento) {
    evento.preventDefault()

    const nombres = datos.nombres.trim()
    const apellidos = datos.apellidos.trim()
    const documento = datos.documento.trim()
    const correo = datos.correo.trim()
    const telefono = datos.telefono.trim()
    const contrasena = datos.contrasena
    const confirmarContrasena = datos.confirmarContrasena

    if (
      nombres === '' ||
      apellidos === '' ||
      documento === '' ||
      correo === '' ||
      telefono === ''
    ) {
      setMensaje('Por favor, completa todos los campos obligatorios.')
      setTipoMensaje('error')
      return
    }

    if (contrasena.length < 8) {
      setMensaje('La contraseña debe tener mínimo 8 caracteres.')
      setTipoMensaje('error')
      return
    }

    if (contrasena !== confirmarContrasena) {
      setMensaje('Las contraseñas no coinciden.')
      setTipoMensaje('error')
      return
    }

    if (!datos.aceptarTerminos) {
      setMensaje('Debes aceptar las condiciones para continuar.')
      setTipoMensaje('error')
      return
    }

    setMensaje(
      'Validación completada. Tu solicitud de registro está lista para ser procesada.'
    )
    setTipoMensaje('exito')

    setDatos({
      nombres: '',
      apellidos: '',
      tipoDocumento: '',
      documento: '',
      empresa: '',
      correo: '',
      telefono: '',
      contrasena: '',
      confirmarContrasena: '',
      aceptarTerminos: false
    })
  }

  return (
    <main className="registro-page">
      <section className="tarjeta-registro">
        <header className="encabezado-registro">
          <Link to="/" className="marca-registro">
            SoftBecX <span>Shield</span>
          </Link>

          <p className="subtitulo-registro">CREA TU CUENTA</p>

          <h1>Registro de cliente</h1>

          <p className="descripcion-registro">
            Completa tus datos para solicitar tu registro en SoftBecX Shield.
          </p>
        </header>

        <form className="formulario-registro" onSubmit={registrarUsuario}>
          <div className="grupo-campos-registro">
            <div className="campo-registro">
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                placeholder="Tus nombres"
                autoComplete="given-name"
                maxLength={80}
                value={datos.nombres}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo-registro">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                placeholder="Tus apellidos"
                autoComplete="family-name"
                maxLength={80}
                value={datos.apellidos}
                onChange={manejarCambio}
                required
              />
            </div>
          </div>

          <div className="grupo-campos-registro">
            <div className="campo-registro">
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={datos.tipoDocumento}
                onChange={manejarCambio}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PAS">Pasaporte</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            <div className="campo-registro">
              <label htmlFor="documento">Número de documento</label>
              <input
                type="text"
                id="documento"
                name="documento"
                placeholder="Número de documento"
                autoComplete="off"
                maxLength={30}
                value={datos.documento}
                onChange={manejarCambio}
                required
              />
            </div>
          </div>

          <div className="campo-registro">
            <label htmlFor="empresa">Empresa</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              placeholder="Nombre de la empresa (si aplica)"
              autoComplete="organization"
              maxLength={120}
              value={datos.empresa}
              onChange={manejarCambio}
            />
          </div>

          <div className="campo-registro">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="usuario@empresa.com"
              autoComplete="email"
              maxLength={254}
              value={datos.correo}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="campo-registro">
            <label htmlFor="telefono">Teléfono de contacto</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Número de contacto"
              autoComplete="tel"
              maxLength={20}
              value={datos.telefono}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="grupo-campos-registro">
            <div className="campo-registro">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                value={datos.contrasena}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo-registro">
              <label htmlFor="confirmarContrasena">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                minLength={8}
                value={datos.confirmarContrasena}
                onChange={manejarCambio}
                required
              />
            </div>
          </div>

          <label className="terminos-registro">
            <input
              type="checkbox"
              id="aceptarTerminos"
              name="aceptarTerminos"
              checked={datos.aceptarTerminos}
              onChange={manejarCambio}
              required
            />

            <span>
              Acepto las condiciones de uso y el tratamiento de mis datos para
              gestionar mi solicitud de registro.
            </span>
          </label>

          <button type="submit" className="boton-registro">
            Crear cuenta
          </button>

          {mensaje && (
            <p
              className={`mensaje-registro ${tipoMensaje}`}
              role="status"
              aria-live="polite"
            >
              {mensaje}
            </p>
          )}
        </form>

        <div className="separador-registro">
          <span></span>
          <p>¿YA TIENES UNA CUENTA?</p>
          <span></span>
        </div>

        <p className="enlace-login-registro">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>

        <Link to="/" className="volver-inicio-registro">
          Volver al inicio
        </Link>

        <p className="nota-registro">
          Formulario demostrativo. Los datos no se guardan en una base de datos.
        </p>
      </section>
    </main>
  )
}

export default RegistroPage
