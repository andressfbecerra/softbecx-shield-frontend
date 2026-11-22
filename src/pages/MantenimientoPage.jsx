
import { Link } from 'react-router-dom'
import './Mantenimiento.css'

function MantenimientoPage() {
  return (
    <div className="pagina-mantenimiento">
      <header className="encabezado-mantenimiento">
        <Link
          className="marca-mantenimiento"
          to="/"
          aria-label="Volver al inicio de SoftBecX Shield"
        >
          <span className="marca-texto-mantenimiento">
            <strong>SoftBecX</strong>
            <span>Shield</span>
          </span>
        </Link>
      </header>

      <main className="contenido-mantenimiento">
        <section className="tarjeta-mantenimiento">
          <div className="ilustracion-mantenimiento">
            <img
              src="/img/mantenimiento.png"
              alt="Ilustración de mantenimiento de SoftBecX Shield"
            />
          </div>

          <p className="etiqueta-mantenimiento">
            AVISO DEL SISTEMA
          </p>

          <h1>
            Estamos mejorando tu
            <span>seguridad digital</span>
          </h1>

          <p className="descripcion-mantenimiento">
            En SoftBecX Shield estamos trabajando para ofrecerte
            una experiencia más segura y confiable. Nuestro sitio
            se encuentra temporalmente en mantenimiento.
          </p>

          <Link className="boton-inicio-mantenimiento" to="/">
            Volver al inicio
          </Link>
        </section>
      </main>
    </div>
  )
}

export default MantenimientoPage
