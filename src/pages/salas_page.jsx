import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useApp } from '../components/app_state'
import { CAMPUS, BLOQUES, SALAS, bloqueOcupado, proximosDias, formatoFecha } from '../data'

export const SalasPage = () => {
  const { usuario, reservasSala, reservarSala } = useApp()
  const navigate = useNavigate()
  // Filtros y selección viven en la URL para sobrevivir el paso por "Ingresar".
  const [params, setParams] = useSearchParams()
  const [confirmada, setConfirmada] = useState(null)
  const dias = proximosDias()

  const campus = params.get('campus') || 'San Joaquín'
  const categoria = params.get('categoria') || 'Todas'
  const capacidad = Number(params.get('capacidad') || 1)
  const dia = Number(params.get('dia') || 0)
  const sel = params.get('sala') ? { salaId: params.get('sala'), bloque: Number(params.get('bloque')) } : null

  const set = (cambios) => {
    const p = new URLSearchParams(params)
    Object.entries(cambios).forEach(([k, v]) => v === null ? p.delete(k) : p.set(k, v))
    setParams(p, { replace: true })
    setConfirmada(null)
  }
  const sinSeleccion = { sala: null, bloque: null }

  const fecha = formatoFecha(dias[dia])
  const reservadoPorMi = (salaId, bloque) => reservasSala.some(r => r.salaId === salaId && r.fecha === fecha && r.bloque === bloque)
  const salas = SALAS
    .map((s, idx) => ({ ...s, idx }))
    .filter(s => s.campus === campus && (categoria === 'Todas' || s.categoria === categoria) && s.capacidad >= capacidad)
  const salaSel = sel && SALAS.find(s => s.id === sel.salaId)

  const confirmar = () => {
    if (!usuario) {
      return navigate('/ingresar', { state: { from: `/salas?${params}`, motivo: 'Ingresa con tu cuenta USM para confirmar la reserva de la sala. Tu selección se mantendrá.' } })
    }
    const r = { salaId: salaSel.id, sala: salaSel.nombre, campus: salaSel.campus, ubicacion: salaSel.ubicacion, fecha, bloque: sel.bloque, horario: BLOQUES[sel.bloque] }
    reservarSala(r)
    set(sinSeleccion)
    setConfirmada(r) // después de set(), que limpia el aviso
  }

  return (
    <div className='salas'>
      <h1>Reservar sala de estudio</h1>

      {confirmada && (
        <div className='success' role='status'>
          <strong>✅ ¡Reserva lista!</strong> {confirmada.sala} ({confirmada.campus}) — {confirmada.fecha}, {confirmada.horario}.
          <br />Preséntate en {confirmada.ubicacion} con tu credencial USM. Tienes 15 minutos de tolerancia.
          <div className='actions'><Link className='btn' to='/mis-reservas'>Ver mis reservas</Link></div>
        </div>
      )}

      <div className='filters'>
        <label className='filters__item'>Campus
          <select className='input' value={campus} onChange={e => set({ campus: e.target.value, ...sinSeleccion })}>
            {CAMPUS.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className='filters__item'>Tipo de sala
          <select className='input' value={categoria} onChange={e => set({ categoria: e.target.value, ...sinSeleccion })}>
            <option>Todas</option><option>Individual</option><option>Grupal</option>
          </select>
        </label>
        <label className='filters__item'>Personas
          <select className='input' value={capacidad} onChange={e => set({ capacidad: e.target.value, ...sinSeleccion })}>
            {[1, 2, 4, 6, 8].map(n => <option key={n} value={n}>{n === 1 ? '1 o más' : `${n} o más`}</option>)}
          </select>
        </label>
      </div>

      <div className='chips' role='tablist' aria-label='Día'>
        {dias.map((d, i) => (
          <button key={i} role='tab' aria-selected={i === dia} className={`chip ${i === dia ? 'chip--active' : ''}`} onClick={() => set({ dia: i, ...sinSeleccion })}>
            {i === 0 ? 'Hoy' : formatoFecha(d)}
          </button>
        ))}
      </div>

      <p className='muted'>Cada bloque dura 1 hora y 10 minutos. Toca un bloque <span className='legend legend--free'>libre</span> para seleccionarlo.</p>

      {salas.length === 0 && <p>No hay salas que cumplan estos filtros en {campus}. Prueba con menos personas o con otro tipo de sala.</p>}

      {salas.map(s => (
        <div key={s.id} className='card'>
          <h2 className='card__title'>{s.nombre}</h2>
          <p className='muted'>{s.categoria} · hasta {s.capacidad} {s.capacidad === 1 ? 'persona' : 'personas'} · {s.ubicacion}</p>
          <div className='slots'>
            {BLOQUES.map((b, i) => {
              const mia = reservadoPorMi(s.id, i)
              const ocupado = mia || bloqueOcupado(s.idx, dia, i)
              const elegido = sel && sel.salaId === s.id && sel.bloque === i
              return (
                <button
                  key={i}
                  disabled={ocupado}
                  className={`slot ${ocupado ? 'slot--busy' : ''} ${elegido ? 'slot--selected' : ''}`}
                  onClick={() => set({ sala: s.id, bloque: i })}
                  aria-pressed={!!elegido}
                >
                  {b}<small>{mia ? 'Tu reserva' : ocupado ? 'Ocupado' : 'Libre'}</small>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {salaSel && (
        <div className='summary'>
          <div><strong>{salaSel.nombre}</strong> · {fecha} · {BLOQUES[sel.bloque]}</div>
          <div className='actions'>
            <button className='btn' onClick={() => set(sinSeleccion)}>Cambiar</button>
            <button className='btn btn--primary' onClick={confirmar}>{usuario ? 'Confirmar reserva' : 'Ingresar y confirmar'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalasPage
