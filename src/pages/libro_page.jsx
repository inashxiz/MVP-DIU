import React, { useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'

import { useApp } from '../components/app_state'
import { LIBROS } from '../data'
import { disponiblesEn } from './catalogo_page'

const enDias = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

export const LibroPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario, reservasLibro, reservarLibro, prestamos, pedirPrestamo } = useApp()
  const libro = LIBROS.find(l => l.id === id)
  const [aviso, setAviso] = useState(null)

  if (!libro) return <p>Libro no encontrado. <Link to='/catalogo'>Volver al catálogo</Link></p>

  const pedirLogin = (motivo) => navigate('/ingresar', { state: { from: location.pathname, motivo } })
  const yaReservado = (campus) => reservasLibro.some(r => r.libroId === libro.id && r.campus === campus)
  const prestamo = prestamos.find(p => p.libroId === libro.id)
  const digitalLibres = libro.digital?.disponibles ?? 0

  const reservar = (copia) => {
    if (!usuario) return pedirLogin('Ingresa con tu cuenta USM para reservar la copia física.')
    const r = { libroId: libro.id, titulo: libro.titulo, campus: copia.campus, signatura: copia.signatura, retiroHasta: enDias(2) }
    reservarLibro(r)
    setAviso(`✅ Copia reservada en ${copia.campus}. Retírala en el mesón de préstamo con tu credencial USM hasta el ${r.retiroHasta}.`)
  }

  const prestar = () => {
    if (!usuario) return pedirLogin('Ingresa con tu cuenta USM para pedir prestada la copia digital.')
    pedirPrestamo({ libroId: libro.id, titulo: libro.titulo, plataforma: libro.digital.plataforma, vence: enDias(14) })
    setAviso('✅ Préstamo digital listo por 14 días. Ya puedes leerlo en línea.')
  }

  return (
    <div className='libro'>
      <button className='link' onClick={() => navigate(-1)}>← Volver</button>
      <h1>{libro.titulo}</h1>
      <p>{libro.autor}</p>
      <p className='muted'>{libro.edicion} · {libro.editorial} · ISBN {libro.isbn}</p>
      <p className='muted'>Temas: {libro.tema}</p>

      {aviso && (
        <div className='success' role='status'>
          {aviso}
          <div className='actions'>
            {prestamo && <Link className='btn btn--primary' to={`/leer/${libro.id}`}>Leer ahora</Link>}
            <Link className='btn' to='/mis-reservas'>Ver mis reservas</Link>
          </div>
        </div>
      )}

      <section className='card'>
        <h2 className='card__title'>📍 Copia física — Estado por campus</h2>
        <table className='estado'>
          <thead><tr><th>Campus</th><th>Signatura</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {libro.copias.map(c => {
              const n = disponiblesEn(libro, c.campus, reservasLibro)
              return (
                <tr key={c.campus}>
                  <td data-label='Campus'>{c.campus}</td>
                  <td data-label='Signatura'>{c.signatura}</td>
                  <td data-label='Estado'><span className={`tag ${n > 0 ? 'tag--ok' : 'tag--no'}`}>{n > 0 ? `${n} de ${c.total} disponible${n > 1 ? 's' : ''}` : `0 de ${c.total} · todas prestadas`}</span></td>
                  <td>
                    {yaReservado(c.campus)
                      ? <Link className='btn btn--small' to='/mis-reservas'>Reservado ✓</Link>
                      : <button className='btn btn--primary btn--small' disabled={n <= 0} onClick={() => reservar(c)}>{n > 0 ? 'Reservar aquí' : 'Sin copias'}</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className='muted'>La reserva se mantiene 48 horas. Retiras el libro en el mesón de préstamo del campus elegido.</p>
      </section>

      <section className='card'>
        <h2 className='card__title'>💻 Copia digital</h2>
        {!libro.digital && <p>Este libro no tiene versión digital en la Biblioteca USM.</p>}
        {libro.digital && prestamo && (
          <>
            <p>Lo tienes prestado hasta el {prestamo.vence}.</p>
            <Link className='btn btn--primary' to={`/leer/${libro.id}`}>Leer ahora</Link>
          </>
        )}
        {libro.digital && !prestamo && (
          <>
            <p>
              Disponible en {libro.digital.plataforma}: <strong>{digitalLibres > 0 ? `${digitalLibres} licencia${digitalLibres > 1 ? 's' : ''} libre${digitalLibres > 1 ? 's' : ''}` : 'todas las licencias en uso'}</strong>.
              Se lee en el navegador durante 14 días, sin descargar nada.
            </p>
            <button className='btn btn--primary' disabled={digitalLibres <= 0} onClick={prestar}>
              {digitalLibres > 0 ? 'Pedir préstamo digital' : 'No disponible por ahora'}
            </button>
          </>
        )}
      </section>
    </div>
  )
}

export default LibroPage
