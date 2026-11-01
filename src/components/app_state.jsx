import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)

// shortcut: estado solo en memoria (se pierde al recargar), basta para el MVP sin backend.
export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [reservasSala, setReservasSala] = useState([])
  const [reservasLibro, setReservasLibro] = useState([])
  const [prestamos, setPrestamos] = useState([])

  const value = {
    usuario,
    ingresar: (correo) => setUsuario({ correo, nombre: correo.split('@')[0].split('.').map(p => p[0].toUpperCase() + p.slice(1)).join(' ') }),
    salir: () => setUsuario(null),
    reservasSala,
    reservarSala: (r) => setReservasSala(rs => [...rs, { ...r, id: Date.now() }]),
    cancelarSala: (id) => setReservasSala(rs => rs.filter(r => r.id !== id)),
    reservasLibro,
    reservarLibro: (r) => setReservasLibro(rs => [...rs, { ...r, id: Date.now() }]),
    cancelarLibro: (id) => setReservasLibro(rs => rs.filter(r => r.id !== id)),
    prestamos,
    pedirPrestamo: (r) => setPrestamos(ps => [...ps, { ...r, id: Date.now() }]),
    devolverPrestamo: (id) => setPrestamos(ps => ps.filter(p => p.id !== id))
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
