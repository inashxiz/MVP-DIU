import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)

// Date.now() se repite si se crean varias reservas en el mismo instante.
let ultimoId = 0
const nuevoId = () => ++ultimoId

// shortcut: estado solo en memoria (se pierde al recargar), basta para el MVP sin backend.
export const AppProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [reservasSala, setReservasSala] = useState([])
  const [reservasLibro, setReservasLibro] = useState([])
  const [prestamos, setPrestamos] = useState([])

  const value = {
    usuario,
    // El correo es inicial del nombre + apellido (jdoe@usm.cl): no permite reconstruir el nombre, se muestra el usuario.
    ingresar: (correo) => setUsuario({ correo, nombre: correo.split('@')[0] }),
    salir: () => setUsuario(null),
    reservasSala,
    reservarSalas: (nuevas) => setReservasSala(rs => [...rs, ...nuevas.map(r => ({ ...r, id: nuevoId() }))]),
    cancelarSala: (id) => setReservasSala(rs => rs.filter(r => r.id !== id)),
    reservasLibro,
    reservarLibro: (r) => setReservasLibro(rs => [...rs, { ...r, id: nuevoId() }]),
    cancelarLibro: (id) => setReservasLibro(rs => rs.filter(r => r.id !== id)),
    prestamos,
    pedirPrestamo: (r) => setPrestamos(ps => [...ps, { ...r, id: nuevoId() }]),
    devolverPrestamo: (id) => setPrestamos(ps => ps.filter(p => p.id !== id))
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
