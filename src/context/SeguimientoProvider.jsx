
import { useEffect, useState } from 'react'
import SeguimientoContext from './SeguimientoContext'

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

function SeguimientoProvider({ children }) {
  const [idsSeguimiento, setIdsSeguimiento] = useState(
    obtenerSeguimientoInicial
  )

  useEffect(() => {
    localStorage.setItem(
      'softbecx-seguimiento',
      JSON.stringify(idsSeguimiento)
    )
  }, [idsSeguimiento])

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

  return (
    <SeguimientoContext.Provider
      value={{
        idsSeguimiento,
        agregarAlSeguimiento,
        retirarDelSeguimiento,
        vaciarSeguimiento
      }}
    >
      {children}
    </SeguimientoContext.Provider>
  )
}

export default SeguimientoProvider
