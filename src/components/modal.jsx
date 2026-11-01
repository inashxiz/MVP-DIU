import React, { useEffect, useId, useRef } from 'react'

// Usa <dialog> nativo: atrapa el foco, cierra con Escape y bloquea el fondo.
export const Modal = ({ open, onClose, title, variant, children }) => {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`modal ${variant ? `modal--${variant}` : ''}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={e => e.target === ref.current && onClose()} // clic en el fondo
    >
      <div className='modal__body'>
        <h2 id={titleId} className='modal__title'>{title}</h2>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
