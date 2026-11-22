
import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import PanelPage from './pages/PanelPage'
import ReportarIncidentePage from './pages/ReportarIncidentePage'
import SeguimientoPage from './pages/SeguimientoPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import RecuperarContrasenaPage from './pages/RecuperarContrasenaPage'
import MantenimientoPage from './pages/MantenimientoPage'
import './App.css'

function obtenerSeguimientoInicial() {
  try {
    const datosGuardados = localStorage.getItem('softbecx-seguimiento')

    if (!datosGuardados) {
      return []
    }

    const ids = JSON.parse(datosGuardados)

    if (!Array.isArray(ids)) {
      return []
    }

    return ids.filter((id) => Number.isInteger(id))
  } catch (error) {
    console.error('Error al recuperar el seguimiento:', error)
    return []
  }
}

function App() {
  const location = useLocation()

  const [idsSeguimiento, setIdsSeguimiento] = useState(
    obtenerSeguimientoInicial
  )

  useEffect(() => {
    localStorage.setItem(
      'softbecx-seguimiento',
      JSON.stringify(idsSeguimiento)
    )
  }, [idsSeguimiento])

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

  function agregarAlSeguimiento(idIncidente) {
    setIdsSeguimiento((listaAnterior) => {
      if (listaAnterior.includes(idIncidente)) {
        return listaAnterior
      }

      return [...listaAnterior, idIncidente]
    })
  }

  function retirarDelSeguimiento(idIncidente) {
    setIdsSeguimiento((listaAnterior) =>
      listaAnterior.filter((id) => id !== idIncidente)
    )
  }

  function vaciarSeguimiento() {
    setIdsSeguimiento([])
  }

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
          element={
            <PanelPage
              idsSeguimiento={idsSeguimiento}
              onAgregarSeguimiento={agregarAlSeguimiento}
              onRetirarSeguimiento={retirarDelSeguimiento}
            />
          }
        />

        <Route
          path="/reportar"
          element={<ReportarIncidentePage />}
        />

        <Route
          path="/seguimiento"
          element={
            <SeguimientoPage
              idsSeguimiento={idsSeguimiento}
              onRetirarSeguimiento={retirarDelSeguimiento}
              onVaciarSeguimiento={vaciarSeguimiento}
            />
          }
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
