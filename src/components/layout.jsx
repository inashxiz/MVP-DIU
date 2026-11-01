import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import { AppProvider } from './app_state'
import NavBar from './nav_bar'

import HomePage from '../pages/home_page'
import SalasPage from '../pages/salas_page'
import CatalogoPage from '../pages/catalogo_page'
import LibroPage from '../pages/libro_page'
import LectorPage from '../pages/lector_page'
import IngresarPage from '../pages/ingresar_page'
import MisReservasPage from '../pages/mis_reservas_page'

const Layout = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className='layout'>
          <header className='layout__header'>
            <Link to='/' className='layout__title'>Biblioteca USM</Link>
            <span className='layout__subtitle'>Universidad Técnica Federico Santa María</span>
          </header>
          <NavBar />
          <main className='layout__page'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/salas' element={<SalasPage />} />
              <Route path='/catalogo' element={<CatalogoPage />} />
              <Route path='/libro/:id' element={<LibroPage />} />
              <Route path='/leer/:id' element={<LectorPage />} />
              <Route path='/ingresar' element={<IngresarPage />} />
              <Route path='/mis-reservas' element={<MisReservasPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default Layout
