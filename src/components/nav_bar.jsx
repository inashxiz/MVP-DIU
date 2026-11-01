import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useApp } from './app_state'

export const NavBar = () => {
  const { usuario, salir, reservasSala, reservasLibro, prestamos } = useApp()
  const navigate = useNavigate()
  const total = reservasSala.length + reservasLibro.length + prestamos.length

  const navLinkClass = ({ isActive }) => {
    const classes = ['nav-bar__link']
    if (isActive) classes.push('nav-bar__link--active')
    return classes.join(' ')
  }
  return (
    <nav className='nav-bar'>
      <NavLink className={navLinkClass} to='/' end>Inicio</NavLink>
      <NavLink className={navLinkClass} to='/salas'>Salas de estudio</NavLink>
      <NavLink className={navLinkClass} to='/catalogo'>Catálogo</NavLink>
      <NavLink className={navLinkClass} to='/mis-reservas'>
        Mis reservas{total > 0 && <span className='nav-bar__badge'>{total}</span>}
      </NavLink>
      {usuario
        ? <button className='nav-bar__link nav-bar__user' onClick={() => { salir(); navigate('/') }}>Salir ({usuario.nombre})</button>
        : <NavLink className={navLinkClass} to='/ingresar'>Ingresar</NavLink>}
    </nav>
  )
}

export default NavBar
