import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useApp } from '../components/app_state'
import { Modal } from '../components/modal'
import { CAMPUS, BLOQUES, SALAS, bloqueOcupado, proximosDias, formatoFecha } from '../data'

// Cada bloque seleccionado se guarda en la URL como "dia:salaId:bloque", separados por coma.
const leerSeleccion = (valor) => (valor ? valor.split(',') : [])
  .map(k => k.split(':'))
  .map(([dia, salaId, bloque]) => ({ dia: Number(dia), salaId, bloque: Number(bloque) }))
  .filter(s => SALAS.some(x => x.id === s.salaId) && BLOQUES[s.bloque])
const clave = (s) => `${s.dia}:${s.salaId}:${s.bloque}`

export const SalasPage = () => {
  const { usuario, reservasSala, reservarSalas } = useApp()
  const navigate = useNavigate()
  // Filtros y selección viven en la URL para sobrevivir el paso por "Ingresar".
  const [params, setParams] = useSearchParams()
  const [confirmadas, setConfirmadas] = useState(null)
  const dias = proximosDias()

  const campus = params.get('campus') || 'San Joaquín'
  const categoria = params.get('categoria') || 'Todas'
  const capacidad = Number(params.get('capacidad') || 1)
  const dia = Number(params.get('dia') || 0)
  const seleccion = leerSeleccion(params.get('sel'))

  const set = (cambios) => {
    const p = new URLSearchParams(params)
    Object.entries(cambios).forEach(([k, v]) => v === null || v === '' ? p.delete(k) : p.set(k, v))
    setParams(p, { replace: true })
  }
  const guardarSeleccion = (lista) => set({ sel: lista.map(clave).join(',') })
  const estaSeleccionado = (salaId, bloque) => seleccion.some(s => s.dia === dia && s.salaId === salaId && s.bloque === bloque)
  const alternar = (salaId, bloque) => {
    const s = { dia, salaId, bloque }
    guardarSeleccion(estaSeleccionado(salaId, bloque)
      ? seleccion.filter(x => clave(x) !== clave(s))
      : [...seleccion, s])
  }
  const quitar = (s) => guardarSeleccion(seleccion.filter(x => clave(x) !== clave(s)))

  const fechaDe = (i) => formatoFecha(dias[i])
  const reservadoPorMi = (salaId, d, bloque) => reservasSala.some(r => r.salaId === salaId && r.fecha === fechaDe(d) && r.bloque === bloque)
  const salas = SALAS
    .map((s, idx) => ({ ...s, idx }))
    .filter(s => s.campus === campus && (categoria === 'Todas' || s.categoria === categoria) && s.capacidad >= capacidad)

  // Selección ordenada por día, sala y bloque, con los datos de la sala.
  const detalle = seleccion
    .map(s => ({ ...s, sala: SALAS.find(x => x.id === s.salaId) }))
    .sort((a, b) => a.dia - b.dia || a.sala.nombre.localeCompare(b.sala.nombre) || a.bloque - b.bloque)

  const confirmar = () => {
    if (!usuario) {
      return navigate('/ingresar', { state: { from: `/salas?${params}`, motivo: 'Ingresa con tu cuenta USM para confirmar la reserva de la sala. Tu selección se mantendrá.' } })
    }
    const nuevas = detalle
      .filter(s => !reservadoPorMi(s.salaId, s.dia, s.bloque))
      .map(s => ({ salaId: s.sala.id, sala: s.sala.nombre, campus: s.sala.campus, ubicacion: s.sala.ubicacion, fecha: fechaDe(s.dia), bloque: s.bloque, horario: BLOQUES[s.bloque] }))
    reservarSalas(nuevas)
    set({ sel: null })
    setConfirmadas(nuevas)
  }

  return (
    <div className='salas'>
      <h1>Reservar sala de estudio</h1>

      <Modal open={!!confirmadas} onClose={() => setConfirmadas(null)} title={`¡${confirmadas?.length > 1 ? `${confirmadas.length} reservas confirmadas` : 'Reserva confirmada'}!`}>
        {confirmadas && (
          <>
            <ul className='modal__list'>
              {confirmadas.map((r, i) => (
                <li key={i}>
                  <strong>{r.sala}</strong> ({r.campus})<br />
                  <span className='muted'>{r.fecha}, {r.horario} · {r.ubicacion}</span>
                </li>
              ))}
            </ul>
            <p className='muted'>Preséntate con tu credencial USM. Tienes 15 minutos de tolerancia.</p>
            <div className='actions'>
              <button className='btn' onClick={() => setConfirmadas(null)} autoFocus>Seguir reservando</button>
              <Link className='btn btn--primary' to='/mis-reservas'>Ver mis reservas</Link>
            </div>
          </>
        )}
      </Modal>

      <div className='filters'>
        <label className='filters__item'>Campus
          <select className='input' value={campus} onChange={e => set({ campus: e.target.value })}>
            {CAMPUS.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className='filters__item'>Tipo de sala
          <select className='input' value={categoria} onChange={e => set({ categoria: e.target.value })}>
            <option>Todas</option><option>Individual</option><option>Grupal</option>
          </select>
        </label>
        <label className='filters__item'>Personas
          <select className='input' value={capacidad} onChange={e => set({ capacidad: e.target.value })}>
            {[1, 2, 4, 6, 8].map(n => <option key={n} value={n}>{n === 1 ? '1 o más' : `${n} o más`}</option>)}
          </select>
        </label>
      </div>

      <div className='chips' role='tablist' aria-label='Día'>
        {dias.map((d, i) => {
          const n = seleccion.filter(s => s.dia === i).length
          return (
            <button key={i} role='tab' aria-selected={i === dia} className={`chip ${i === dia ? 'chip--active' : ''}`} onClick={() => set({ dia: i })}>
              {d.toDateString() === new Date().toDateString() ? 'Hoy' : formatoFecha(d)}{n > 0 && <span className='chip__count' aria-label={`${n} seleccionados`}>{n}</span>}
            </button>
          )
        })}
      </div>

      <p className='muted'>Cada bloque dura 1 hora y 10 minutos. Toca uno o más bloques <span className='legend legend--free'>libres</span> para seleccionarlos; puedes combinar salas y días antes de confirmar.</p>

      {salas.length === 0 && <p>No hay salas que cumplan estos filtros en {campus}. Prueba con menos personas o con otro tipo de sala.</p>}

      {salas.map(s => (
        <div key={s.id} className='card'>
          <h2 className='card__title'>{s.nombre}</h2>
          <p className='muted'>{s.categoria} · hasta {s.capacidad} {s.capacidad === 1 ? 'persona' : 'personas'} · {s.ubicacion}</p>
          <div className='slots'>
            {BLOQUES.map((b, i) => {
              const mia = reservadoPorMi(s.id, dia, i)
              const ocupado = mia || bloqueOcupado(s.idx, dia, i)
              const elegido = estaSeleccionado(s.id, i)
              return (
                <button
                  key={i}
                  disabled={ocupado}
                  className={`slot ${ocupado ? 'slot--busy' : ''} ${elegido ? 'slot--selected' : ''}`}
                  onClick={() => alternar(s.id, i)}
                  aria-pressed={elegido}
                >
                  {b}<small>{mia ? 'Tu reserva' : ocupado ? 'Ocupado' : elegido ? 'Seleccionado ✓' : 'Libre'}</small>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {detalle.length > 0 && (
        <div className='summary'>
          <div className='summary__info'>
            <strong>{detalle.length} {detalle.length === 1 ? 'bloque seleccionado' : 'bloques seleccionados'}</strong>
            <ul className='summary__list'>
              {detalle.map(s => (
                <li key={clave(s)} className='summary__item'>
                  {s.sala.nombre} ({s.sala.campus}) · {fechaDe(s.dia)} · {BLOQUES[s.bloque]}
                  <button className='summary__remove' onClick={() => quitar(s)} aria-label={`Quitar ${s.sala.nombre}, ${fechaDe(s.dia)}, ${BLOQUES[s.bloque]}`}>×</button>
                </li>
              ))}
            </ul>
          </div>
          <div className='actions'>
            <button className='btn' onClick={() => set({ sel: null })}>Limpiar</button>
            <button className='btn btn--primary' onClick={confirmar}>
              {usuario ? `Confirmar ${detalle.length > 1 ? `${detalle.length} reservas` : 'reserva'}` : 'Ingresar y confirmar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalasPage
