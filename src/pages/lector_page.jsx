import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useApp } from '../components/app_state'
import { LIBROS } from '../data'

export const LectorPage = () => {
  const { id } = useParams()
  const { prestamos } = useApp()
  const [cap, setCap] = useState(0)
  const libro = LIBROS.find(l => l.id === id)
  const prestamo = prestamos.find(p => p.libroId === id)

  if (!libro || !prestamo) {
    return <p>Para leer este libro primero pide el préstamo digital. <Link to={`/libro/${id}`}>Ir a la ficha del libro</Link></p>
  }

  return (
    <div className='lector'>
      <div className='lector__bar'>
        <Link to={`/libro/${id}`}>← Ficha del libro</Link>
        <span className='muted'>Préstamo hasta el {prestamo.vence}</span>
      </div>
      <h1>{libro.titulo}</h1>
      <label className='filters__item'>Capítulo
        <select className='input' value={cap} onChange={e => setCap(Number(e.target.value))}>
          {libro.capitulos.map((c, i) => <option key={i} value={i}>{i + 1}. {c}</option>)}
        </select>
      </label>
      <article className='lector__page'>
        <h2>Capítulo {cap + 1}: {libro.capitulos[cap]}</h2>
        <p>Vista de lectura simulada para el MVP. Aquí se mostraría el contenido del capítulo “{libro.capitulos[cap]}” de {libro.autor}, servido por {prestamo.plataforma} dentro de la misma página de la biblioteca.</p>
      </article>
      <div className='actions'>
        <button className='btn' disabled={cap === 0} onClick={() => setCap(cap - 1)}>← Anterior</button>
        <button className='btn' disabled={cap === libro.capitulos.length - 1} onClick={() => setCap(cap + 1)}>Siguiente →</button>
      </div>
    </div>
  )
}

export default LectorPage
