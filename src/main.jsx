
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import SeguimientoProvider from './context/SeguimientoProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SeguimientoProvider>
        <App />
      </SeguimientoProvider>
    </BrowserRouter>
  </StrictMode>,
)
