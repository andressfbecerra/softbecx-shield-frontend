
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="softbecx-header">
      <Link className="logo" to="/">
        <span>SoftBecX</span>{' '}
        <span style={{ color: '#C62828' }}>Shield</span>
      </Link>

      <nav className="menu">
        <Link to="/">INICIO</Link>
        <Link to="/alertas">ALERTAS</Link>
        <Link to="/reportar">REPORTAR INCIDENTE</Link>
        <Link to="/seguimiento">SEGUIMIENTO</Link>
        <Link to="/login">INICIAR SESIÓN</Link>
      </nav>
    </header>
  )
}

export default Header
