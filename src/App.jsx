
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import PanelPage from './pages/PanelPage'
import AlertasPage from './pages/AlertasPage'
import ReportarIncidentePage from './pages/ReportarIncidentePage'
import SeguimientoPage from './pages/SeguimientoPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import RecuperarContrasenaPage from './pages/RecuperarContrasenaPage'
import MantenimientoPage from './pages/MantenimientoPage'
import './App.css'

function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      return
    }

    const identificador = decodeURIComponent(
      location.hash.substring(1)
    )

    const elemento = document.getElementById(identificador)

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [location])

  const ocultarHeader =
    location.pathname === '/login' ||
    location.pathname === '/registro' ||
    location.pathname === '/recuperar' ||
    location.pathname === '/mantenimiento'

  return (
    <>
      {!ocultarHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={<PanelPage />}
        />

        <Route
          path="/alertas"
          element={<AlertasPage />}
        />

        <Route
          path="/reportar"
          element={<ReportarIncidentePage />}
        />

        <Route
          path="/seguimiento"
          element={<SeguimientoPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/registro"
          element={<RegistroPage />}
        />

        <Route
          path="/recuperar"
          element={<RecuperarContrasenaPage />}
        />

        <Route
          path="/mantenimiento"
          element={<MantenimientoPage />}
        />
      </Routes>
    </>
  )
}

export default App
