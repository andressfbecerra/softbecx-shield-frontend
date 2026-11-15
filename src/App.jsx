
import { useState, useEffect } from 'react'
import Header from './components/Header'
import AlertaCard from './components/AlertaCard'
import './App.css'

function App() {
  const [textoBusqueda, setTextoBusqueda] = useState('')

  const [alertas, setAlertas] = useState([
    {
      id: 1,
      nombre: 'Correo sospechoso',
      descripcion: 'Posible intento de phishing detectado.',
      nivelRiesgo: 'Riesgo alto'
    },
    {
      id: 2,
      nombre: 'Enlace sospechoso',
      descripcion: 'Se detectó una URL que podría dirigir a un sitio fraudulento.',
      nivelRiesgo: 'Riesgo medio'
    },
    {
      id: 3,
      nombre: 'Actividad inusual',
      descripcion: 'Se identificó un comportamiento de acceso fuera de lo habitual.',
      nivelRiesgo: 'Riesgo bajo'
    }
  ])

  const [nombreIncidente, setNombreIncidente] = useState('')
  const [descripcionIncidente, setDescripcionIncidente] = useState('')
  const [nivelRiesgoIncidente, setNivelRiesgoIncidente] = useState('Riesgo medio')

  useEffect(() => {
    console.log('Panel de seguridad cargado')
  }, [])

  useEffect(() => {
    console.log('La lista de alertas ha cambiado:', alertas.length)
  }, [alertas])

  function buscarAlerta(evento) {
    setTextoBusqueda(evento.target.value)
  }

  function enviarReporte(evento) {
    evento.preventDefault()

    const nuevaAlerta = {
      id: Date.now(),
      nombre: nombreIncidente,
      descripcion: descripcionIncidente,
      nivelRiesgo: nivelRiesgoIncidente
    }

    setAlertas([...alertas, nuevaAlerta])

    setNombreIncidente('')
    setDescripcionIncidente('')
    setNivelRiesgoIncidente('Riesgo medio')
  }

  const totalAlertas = alertas.reduce((acumulador) => {
    return acumulador + 1
  }, 0)

  const alertasRiesgoAlto = alertas.reduce((acumulador, alerta) => {
    return alerta.nivelRiesgo === 'Riesgo alto'
      ? acumulador + 1
      : acumulador
  }, 0)

  return (
    <>
      <Header />

      <main>
        <h1>Panel de seguridad</h1>

        <p>Total de alertas: {totalAlertas}</p>

        <p>Alertas de riesgo alto: {alertasRiesgoAlto}</p>

        <input
          type="text"
          placeholder="Buscar alerta..."
          value={textoBusqueda}
          onChange={buscarAlerta}
        />

        <p>Texto de búsqueda: {textoBusqueda}</p>

        {alertas.map((alerta) => (
          <AlertaCard
            key={alerta.id}
            nombre={alerta.nombre}
            descripcion={alerta.descripcion}
            nivelRiesgo={alerta.nivelRiesgo}
          />
        ))}

        <section id="reportar">
          <h2>Reportar incidente de seguridad</h2>

          <form onSubmit={enviarReporte}>
            <label htmlFor="nombreIncidente">
              Nombre del incidente
            </label>

            <input
              type="text"
              id="nombreIncidente"
              placeholder="Ejemplo: Correo sospechoso"
              value={nombreIncidente}
              onChange={(evento) => setNombreIncidente(evento.target.value)}
              required
            />

            <label htmlFor="descripcionIncidente">
              Descripción del incidente
            </label>

            <textarea
              id="descripcionIncidente"
              placeholder="Describe el incidente..."
              value={descripcionIncidente}
              onChange={(evento) => setDescripcionIncidente(evento.target.value)}
              required
            />

            <label htmlFor="nivelRiesgoIncidente">
              Nivel de riesgo
            </label>

            <select
              id="nivelRiesgoIncidente"
              value={nivelRiesgoIncidente}
              onChange={(evento) => setNivelRiesgoIncidente(evento.target.value)}
            >
              <option value="Riesgo alto">Riesgo alto</option>
              <option value="Riesgo medio">Riesgo medio</option>
              <option value="Riesgo bajo">Riesgo bajo</option>
            </select>

            <button type="submit">
              Enviar reporte
            </button>
          </form>
        </section>
      </main>
    </>
  )
}

export default App
