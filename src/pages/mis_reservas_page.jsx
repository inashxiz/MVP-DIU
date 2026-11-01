import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { useApp } from '../components/app_state'
import { Modal } from '../components/modal'

export const MisReservasPage = () => {
  const { usuario, reservasSala, cancelarSala, reservasLibro, cancelarLibro, prestamos, devolverPrestamo } = useApp()
  // Acción pendiente de confirmar: { titulo, detalle, boton, ejecutar }
  const [pendiente, setPendiente] = useState(null)
  const cerrar = () => setPendiente(null)

  if (!usuario) {
    return (
      <div>
        <h1>Mis reservas</h1>
        <p>Ingresa con tu cuenta USM para ver tus reservas y préstamos.</p>
        <Link className='btn btn--primary' to='/ingresar' state={{ from: '/mis-reservas' }}>Ingresar</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Mis reservas</h1>

      <Modal open={!!pendiente} onClose={cerrar} title={pendiente?.titulo} variant='danger'>
        {pendiente && (
          <>
            <p>{pendiente.detalle}</p>
            <p className='muted'>Esta acción no se puede deshacer.</p>
            <div className='actions'>
              <button className='btn' onClick={cerrar} autoFocus>No, mantener</button>
              <button className='btn btn--danger' onClick={() => { pendiente.ejecutar(); cerrar() }}>{pendiente.boton}</button>
            </div>
          </>
        )}
      </Modal>

      <section className='card'>
        <h2 className='card__title'>🪑 Salas de estudio</h2>
        {reservasSala.length === 0 && <p className='muted'>No tienes salas reservadas. <Link to='/salas'>Reservar una sala</Link></p>}
        {reservasSala.map(r => (
          <div key={r.id} className='item'>
            <div><strong>{r.sala}</strong> · {r.campus}<br /><span className='muted'>{r.fecha}, {r.horario} · {r.ubicacion}</span></div>
            <button className='btn btn--small' onClick={() => setPendiente({ titulo: '¿Cancelar reserva de sala?', detalle: <><strong>{r.sala}</strong> ({r.campus}) — {r.fecha}, {r.horario}. El bloque quedará libre para otras personas.</>, boton: 'Sí, cancelar reserva', ejecutar: () => cancelarSala(r.id) })}>Cancelar</button>
          </div>
        ))}
      </section>

      <section className='card'>
        <h2 className='card__title'>📍 Libros físicos por retirar</h2>
        {reservasLibro.length === 0 && <p className='muted'>No tienes libros reservados. <Link to='/catalogo'>Buscar en el catálogo</Link></p>}
        {reservasLibro.map(r => (
          <div key={r.id} className='item'>
            <div><Link to={`/libro/${r.libroId}`}><strong>{r.titulo}</strong></Link><br /><span className='muted'>Retirar en {r.campus} hasta el {r.retiroHasta} · {r.signatura}</span></div>
            <button className='btn btn--small' onClick={() => setPendiente({ titulo: '¿Cancelar reserva de libro?', detalle: <><strong>{r.titulo}</strong>, para retirar en {r.campus}. La copia quedará disponible para otras personas.</>, boton: 'Sí, cancelar reserva', ejecutar: () => cancelarLibro(r.id) })}>Cancelar</button>
          </div>
        ))}
      </section>

      <section className='card'>
        <h2 className='card__title'>💻 Préstamos digitales</h2>
        {prestamos.length === 0 && <p className='muted'>No tienes libros digitales prestados. <Link to='/catalogo'>Buscar en el catálogo</Link></p>}
        {prestamos.map(p => (
          <div key={p.id} className='item'>
            <div><strong>{p.titulo}</strong><br /><span className='muted'>{p.plataforma} · vence el {p.vence}</span></div>
            <div className='actions'>
              <Link className='btn btn--primary btn--small' to={`/leer/${p.libroId}`}>Leer</Link>
              <button className='btn btn--small' onClick={() => setPendiente({ titulo: '¿Devolver préstamo digital?', detalle: <><strong>{p.titulo}</strong> ({p.plataforma}). Perderás el acceso al libro digital.</>, boton: 'Sí, devolver', ejecutar: () => devolverPrestamo(p.id) })}>Devolver</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default MisReservasPage
