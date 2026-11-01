import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useApp } from "../components/app_state";
import { LIBROS } from "../data";

export const HomePage = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { usuario } = useApp();

  return (
    <>
      <p className="home__saludo">
        {usuario
          ? `Hola, ${usuario.nombre}`
          : "¡Te damos la bienvenida a la Biblioteca USM!"}
      </p>

      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/catalogo?q=${encodeURIComponent(q)}`);
        }}
      >
        <label htmlFor="home-q" className="search__label">
          Buscar libros (físicos y digitales)
        </label>
        <div className="search__row">
          <input
            id="home-q"
            list="titulos"
            className="input"
            placeholder="Ej: The C++ Programming Language, cálculo, Stewart…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn--primary">Buscar</button>
        </div>
        <datalist id="titulos">
          {LIBROS.map((l) => (
            <option key={l.id} value={l.titulo} />
          ))}
        </datalist>
      </form>

      <div className="cards">
        <Link to="/salas" className="card card--link">
          <h2 className="card__title">Reservar sala de estudio</h2>
          <p>
            Elige campus, tipo de sala y capacidad. Ve los bloques libres y
            reserva en un paso.
          </p>
        </Link>
        <Link to="/catalogo" className="card card--link">
          <h2 className="card__title">Catálogo de libros</h2>
          <p>
            Busca un libro, filtra por campus y revisa cuántas copias quedan.
            Reserva la copia física o pide prestada la digital desde la misma
            ficha.
          </p>
        </Link>
        <Link to="/mis-reservas" className="card card--link">
          <h2 className="card__title">Mis reservas y préstamos</h2>
          <p>
            Revisa tus salas reservadas, libros por retirar y libros digitales
            para leer.
          </p>
        </Link>
      </div>

      <div className="notice">
        <strong>¿Física o digital?</strong> La <em>copia física</em> se retira
        en el mesón de préstamo del campus. La <em>copia digital</em> se lee en
        línea durante 14 días. Ambas se piden con tu cuenta USM.
      </div>
    </>
  );
};

export default HomePage;
