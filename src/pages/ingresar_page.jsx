import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useApp } from '../components/app_state'

export const IngresarPage = () => {
  const { ingresar } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const volverA = location.state?.from || '/'

  const onSubmit = (e) => {
    e.preventDefault()
    const c = correo.trim().toLowerCase()
    if (!/^[a-z][a-z]+\d*@(usm\.cl|sansano\.usm\.cl)$/.test(c)) {
      return setError('Usa tu correo institucional completo, por ejemplo: tperez@usm.cl (inicial del nombre + apellido)')
    }
    if (clave.length < 4) return setError('Ingresa tu contraseña de SIGA / AULA.')
    ingresar(c)
    navigate(volverA, { replace: true })
  }

  return (
    <form className='form' onSubmit={onSubmit}>
      <h1>Ingresar con tu cuenta USM</h1>
      {location.state?.motivo && <div className='notice'>{location.state.motivo}</div>}
      <p className='muted'>Es la misma cuenta que usas en SIGA y AULA. No necesitas crear una cuenta nueva en la biblioteca.</p>
      <label className='form__label' htmlFor='correo'>Correo institucional</label>
      <input id='correo' className='input' type='email' autoComplete='username' placeholder='tperez@usm.cl' value={correo} onChange={e => setCorreo(e.target.value)} />
      <small className='muted'>Formato: inicial del nombre + apellido, por ejemplo tperez@usm.cl (o @sansano.usm.cl)</small>
      <label className='form__label' htmlFor='clave'>Contraseña</label>
      <input id='clave' className='input' type='password' autoComplete='current-password' value={clave} onChange={e => setClave(e.target.value)} />
      {error && <p className='error' role='alert'>{error}</p>}
      <button className='btn btn--primary btn--block'>Ingresar</button>
    </form>
  )
}

export default IngresarPage
