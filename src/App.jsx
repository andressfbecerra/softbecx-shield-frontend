
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import PanelPage from './pages/PanelPage'
import ReportarIncidentePage from './pages/ReportarIncidentePage'
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

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<PanelPage />} />
        <Route path="/reportar" element={<ReportarIncidentePage />} />
      </Routes>
    </>
  )
}

export default App
