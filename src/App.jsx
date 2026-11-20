
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import PanelPage from './pages/PanelPage'
import ReportarIncidentePage from './pages/ReportarIncidentePage'
import './App.css'

function App() {
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
