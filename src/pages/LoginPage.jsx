
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

function LoginPage() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [recordarme, setRecordarme] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')

  function iniciarSesion(evento) {
    evento.preventDefault()

    const correoLimpio = correo.trim()

    if (correoLimpio === '' || contrasena === '') {
      setMensaje('Por favor, completa todos los campos.')
      setTipoMensaje('error')
      return
    }

    if (contrasena.length < 8) {
      setMensaje('La contraseña debe tener mínimo 8 caracteres.')
      setTipoMensaje('error')
      return
    }

    setMensaje('Validación completada. La autenticación real aún no está disponible.')
    setTipoMensaje('exito')
    setCorreo('')
    setContrasena('')
    setRecordarme(false)
  }

  return (
    <main className="login-page">
      <section className="tarjeta-login">

        <div className="marca-login" aria-label="SoftBecX Shield">
          <h2>SoftBecX</h2>
          <p>Shield</p>
        </div>

        <header className="encabezado-tarjeta">
          <p className="subtitulo">BIENVENIDO DE NUEVO</p>
          <h1>Inicia sesión</h1>
          <p className="texto-tarjeta">
            Introduce tus datos para continuar.
          </p>
        </header>

        <form className="formulario-login" onSubmit={iniciarSesion}>
          <div className="campo-login">
            <label htmlFor="correo-login">Correo electrónico</label>
            <input
              type="email"
              id="correo-login"
              name="correo"
              placeholder="usuario@empresa.com"
              autoComplete="email"
              value={correo}
              onChange={(evento) => {
                setCorreo(evento.target.value)
                setMensaje('')
                setTipoMensaje('')
              }}
              required
            />
          </div>

          <div className="campo-login">
            <label htmlFor="contrasena-login">Contraseña</label>
            <input
              type="password"
              id="contrasena-login"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              minLength={8}
              value={contrasena}
              onChange={(evento) => {
                setContrasena(evento.target.value)
                setMensaje('')
                setTipoMensaje('')
              }}
              required
            />
          </div>

          <div className="opciones-login">
            <label className="recordar-login">
              <input
                type="checkbox"
                name="recordarme"
                checked={recordarme}
                onChange={(evento) => setRecordarme(evento.target.checked)}
              />
              <span>Recordarme</span>
            </label>

            <Link to="/recuperar" className="enlace-login">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="boton-login">
            Iniciar sesión
          </button>

          {mensaje && (
            <p
              className={`mensaje-login ${tipoMensaje}`}
              role="status"
              aria-live="polite"
            >
              {mensaje}
            </p>
          )}
        </form>

        <div className="separador-login">
          <span></span>
          <p>ACCESO A LA PLATAFORMA</p>
          <span></span>
        </div>

        <p className="registro-login">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="enlace-login">
            Regístrate
          </Link>
        </p>

        <Link to="/" className="volver-login">
          Volver al inicio
        </Link>

        <p className="nota-login">
          Interfaz demostrativa. Autenticación no implementada.
        </p>
      </section>
    </main>
  )
}

export default LoginPage
