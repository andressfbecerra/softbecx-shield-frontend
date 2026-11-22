
import { useContext } from 'react'
import SeguimientoContext from './SeguimientoContext'

function useSeguimiento() {
  const contexto = useContext(SeguimientoContext)

  if (contexto === null) {
    throw new Error(
      'useSeguimiento debe utilizarse dentro de SeguimientoProvider'
    )
  }

  return contexto
}

export default useSeguimiento
