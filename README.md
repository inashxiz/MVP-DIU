# Biblioteca USM — MVP

MVP en React (solo frontend, datos simulados) del proyecto *Biblioteca USM: Descubrimiento de Recursos* (Diseño de Interfaces Usuarias).

Metas de usuario implementadas:

1. **Reservar una sala de estudio** (H1): `/salas` — filtro por campus, tipo, capacidad y día; bloques libres/ocupados; una sola confirmación.
2. **Buscar un libro y filtrar por campus / disponibilidad** (H2): `/catalogo` → ficha `/libro/:id` con la sección "Estado" por campus.
3. **Reservar la copia física** (H5): botón "Reservar aquí" en la ficha del libro.
4. **Pedir prestada la copia digital y leerla** (H3): "Pedir préstamo digital" → "Leer ahora" (`/leer/:id`).
5. Todo en un mismo sitio, con "Mis reservas" como cierre de cada flujo (H6). El ingreso usa la cuenta USM (`nombre.apellido@usm.cl`) con el formato indicado explícitamente.

Base: https://github.com/alexarenasf/frontend-sample-app

This repo includes `Webpack` to start an environment to build frontend views using `React`.

### Requirements

- Node >= 16.13.1
- npm >= 8.1.2

### Quick start

Install dependences

```
npm install
```

Launch environment

```
npm run dev
```

Now you can open http://localhost:5050

### Packages included

- [Webpack](https://webpack.js.org/)
- [React Router](https://reactrouter.com/en/main)

### About stylesheets

- Sample stylesheets were written using the [BEM](https://getbem.com/) structure
