
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="softbecx-header">
      <Link className="logo" to="/">
        SoftBecX Shield
      </Link>

      <nav className="menu">
        <Link to="/">INICIO</Link>
        <Link to="/#alertas">ALERTAS</Link>
        <Link to="/#incidentes">INCIDENTES</Link>
        <Link to="/reportar">REPORTAR INCIDENTE</Link>
      </nav>
    </header>
  )
}

export default Header
