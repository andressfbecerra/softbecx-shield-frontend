
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './RecuperarContrasena.css'

function RecuperarContrasenaPage() {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')

  function manejarRecuperacion(evento) {
    evento.preventDefault()

    setMensaje(
      'La recuperación real todavía no está habilitada. No se ha enviado ningún correo.'
    )
  }

  return (
    <main className="pagina-recuperacion">
      <header className="encabezado-recuperacion">
        <div className="contenedor-header-recuperacion">
          <Link className="logo-recuperacion" to="/">
            SOFTBECX <span>SHIELD</span>
          </Link>

          <Link
            className="enlace-inicio-recuperacion"
            to="/login"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <section className="contenido-recuperacion">
        <div className="contenedor-recuperacion">
          <div className="introduccion-recuperacion">
            <h1>¿Olvidaste tu contraseña?</h1>

            <p>
              No te preocupes. Puedes iniciar el proceso para recuperar
              el acceso a tu cuenta.
            </p>
          </div>

          <div className="tarjeta-recuperacion">
            <div className="imagen-recuperacion">
              <img
                src="/img/contrasena.png"
                alt="Ilustración de recuperación de contraseña"
              />
            </div>

            <h2>Recupera tu contraseña</h2>

            <p className="descripcion-recuperacion">
              Ingresa el correo electrónico asociado a tu cuenta.
            </p>

            <form
              id="formulario-recuperacion"
              onSubmit={manejarRecuperacion}
            >
              <div className="grupo-campo-recuperacion">
                <label htmlFor="correo-recuperacion">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  id="correo-recuperacion"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  value={correo}
                  onChange={(evento) => {
                    setCorreo(evento.target.value)
                    setMensaje('')
                  }}
                  required
                />

                <small className="ayuda-campo-recuperacion">
                  Utiliza el correo que registraste en SoftBecX Shield.
                </small>
              </div>

              <button
                className="boton-recuperacion"
                type="submit"
              >
                Enviar instrucciones
              </button>
            </form>

            {mensaje && (
              <p
                className="mensaje-recuperacion"
                role="status"
                aria-live="polite"
              >
                {mensaje}
              </p>
            )}

            <Link
              className="volver-recuperacion"
              to="/login"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RecuperarContrasenaPage
