import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useApp } from '../components/app_state'
import { CAMPUS, LIBROS, normalizar } from '../data'

// Copias físicas disponibles descontando las reservas hechas en esta sesión.
export const disponiblesEn = (libro, campus, reservasLibro) => {
  const copia = libro.copias.find(c => c.campus === campus)
  if (!copia) return 0
  return copia.disponibles - reservasLibro.filter(r => r.libroId === libro.id && r.campus === campus).length
}

export const CatalogoPage = () => {
  const { reservasLibro } = useApp()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const campus = params.get('campus') || 'Todos'
  const soloDisp = params.get('disp') === '1'
  const [texto, setTexto] = useState(q)

  const set = (cambios) => {
    const p = new URLSearchParams(params)
    Object.entries(cambios).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k))
    setParams(p, { replace: true })
  }

  const palabras = normalizar(q).split(/\s+/).filter(Boolean)
  const resultados = LIBROS.filter(l => {
    const texto = normalizar(`${l.titulo} ${l.autor} ${l.tema} ${l.isbn}`)
    if (!palabras.every(p => texto.includes(p))) return false
    const campusLibro = campus === 'Todos' ? l.copias.map(c => c.campus) : [campus]
    if (campus !== 'Todos' && !l.copias.some(c => c.campus === campus)) return false
    if (soloDisp && !campusLibro.some(c => disponiblesEn(l, c, reservasLibro) > 0)) return false
    return true
  })

  return (
    <div>
      <h1>Catálogo</h1>
      <form className='search' onSubmit={(e) => { e.preventDefault(); set({ q: texto }) }}>
        <div className='search__row'>
          <input aria-label='Buscar por título, autor o tema' list='titulos-cat' className='input' placeholder='Título, autor, tema o ISBN' value={texto} onChange={e => setTexto(e.target.value)} />
          <button className='btn btn--primary'>Buscar</button>
        </div>
        <datalist id='titulos-cat'>{LIBROS.map(l => <option key={l.id} value={l.titulo} />)}</datalist>
      </form>

      <div className='filters'>
        <label className='filters__item'>Campus
          <select className='input' value={campus} onChange={e => set({ campus: e.target.value === 'Todos' ? null : e.target.value })}>
            <option>Todos</option>
            {CAMPUS.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className='filters__check'>
          <input type='checkbox' checked={soloDisp} onChange={e => set({ disp: e.target.checked ? '1' : null })} />
          Solo con copias físicas disponibles
        </label>
      </div>

      <p className='muted'>{resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}{q && <> para “{q}”</>}{campus !== 'Todos' && <> en {campus}</>}</p>

      {resultados.length === 0 && (
        <p>No encontramos libros con esos criterios. Revisa la ortografía o <button className='link' onClick={() => { setTexto(''); setParams({}, { replace: true }) }}>limpia los filtros</button>.</p>
      )}

      {resultados.map(l => {
        const campusMostrar = campus === 'Todos' ? l.copias : l.copias.filter(c => c.campus === campus)
        return (
          <Link key={l.id} to={`/libro/${l.id}`} className='card card--link result'>
            <h2 className='card__title'>{l.titulo}</h2>
            <p className='muted'>{l.autor} · {l.edicion} · {l.editorial}</p>
            <div className='tags'>
              {campusMostrar.map(c => {
                const n = disponiblesEn(l, c.campus, reservasLibro)
                return <span key={c.campus} className={`tag ${n > 0 ? 'tag--ok' : 'tag--no'}`}>📍 {c.campus}: {n > 0 ? `${n} disponible${n > 1 ? 's' : ''}` : 'sin copias libres'}</span>
              })}
              {l.digital && <span className={`tag ${l.digital.disponibles > 0 ? 'tag--ok' : 'tag--no'}`}>💻 Digital: {l.digital.disponibles > 0 ? 'disponible' : 'en espera'}</span>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default CatalogoPage
