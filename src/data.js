// Datos simulados (no hay backend): campus, salas, bloques y catálogo de la Biblioteca USM.

export const CAMPUS = [
  'San Joaquín',
  'Casa Central Valparaíso',
  'Vitacura',
  'Sede Viña del Mar',
  'Sede Concepción'
]

// Bloques horarios USM (2 módulos de 35 min cada uno)
export const BLOQUES = [
  '08:15 – 09:25',
  '09:40 – 10:50',
  '11:05 – 12:15',
  '12:30 – 13:40',
  '14:40 – 15:50',
  '16:05 – 17:15',
  '17:30 – 18:40'
]

export const SALAS = [
  { id: 'sj-ind-1', campus: 'San Joaquín', nombre: 'Cubículo Individual 1', categoria: 'Individual', capacidad: 1, ubicacion: 'Biblioteca, piso 2' },
  { id: 'sj-ind-2', campus: 'San Joaquín', nombre: 'Cubículo Individual 2', categoria: 'Individual', capacidad: 1, ubicacion: 'Biblioteca, piso 2' },
  { id: 'sj-gr-1', campus: 'San Joaquín', nombre: 'Sala Grupal A', categoria: 'Grupal', capacidad: 4, ubicacion: 'Biblioteca, piso 1' },
  { id: 'sj-gr-2', campus: 'San Joaquín', nombre: 'Sala Grupal B', categoria: 'Grupal', capacidad: 6, ubicacion: 'Biblioteca, piso 1' },
  { id: 'sj-gr-3', campus: 'San Joaquín', nombre: 'Sala Grupal C', categoria: 'Grupal', capacidad: 8, ubicacion: 'Biblioteca, piso 3' },
  { id: 'cc-ind-1', campus: 'Casa Central Valparaíso', nombre: 'Cubículo Individual 1', categoria: 'Individual', capacidad: 1, ubicacion: 'Biblioteca Central, piso 2' },
  { id: 'cc-gr-1', campus: 'Casa Central Valparaíso', nombre: 'Sala Grupal 1', categoria: 'Grupal', capacidad: 6, ubicacion: 'Biblioteca Central, piso 1' },
  { id: 'cc-gr-2', campus: 'Casa Central Valparaíso', nombre: 'Sala Grupal 2', categoria: 'Grupal', capacidad: 8, ubicacion: 'Biblioteca Central, piso 3' },
  { id: 'vi-gr-1', campus: 'Vitacura', nombre: 'Sala Grupal 1', categoria: 'Grupal', capacidad: 4, ubicacion: 'Biblioteca, piso 1' },
  { id: 'vm-gr-1', campus: 'Sede Viña del Mar', nombre: 'Sala Grupal 1', categoria: 'Grupal', capacidad: 6, ubicacion: 'Biblioteca, piso 1' },
  { id: 'co-gr-1', campus: 'Sede Concepción', nombre: 'Sala Grupal 1', categoria: 'Grupal', capacidad: 4, ubicacion: 'Biblioteca, piso 1' }
]

// Ocupación simulada y determinista por sala, día y bloque.
export const bloqueOcupado = (salaIdx, dia, bloque) => (salaIdx * 7 + dia * 3 + bloque * 5) % 3 === 0

export const LIBROS = [
  {
    id: 'cpp-stroustrup',
    titulo: 'The C++ Programming Language',
    autor: 'Bjarne Stroustrup',
    edicion: '4th ed.',
    editorial: 'Addison-Wesley, 2013',
    isbn: '978-0-321-56384-2',
    tema: 'Programación, C++, lenguajes de programación',
    copias: [
      { campus: 'San Joaquín', signatura: '005.133 S927 2013', total: 2, disponibles: 1 },
      { campus: 'Casa Central Valparaíso', signatura: '005.133 S927 2013', total: 3, disponibles: 0 },
      { campus: 'Vitacura', signatura: '005.133 S927 2013', total: 1, disponibles: 1 }
    ],
    digital: { plataforma: 'eLibro', disponibles: 2 },
    capitulos: ['Notes to the Reader', 'A Tour of C++: The Basics', 'A Tour of C++: Abstraction Mechanisms', 'A Tour of C++: Containers and Algorithms', 'A Tour of C++: Concurrency and Utilities']
  },
  {
    id: 'cpp-primer',
    titulo: 'C++ Primer',
    autor: 'Stanley B. Lippman, Josée Lajoie, Barbara E. Moo',
    edicion: '5th ed.',
    editorial: 'Addison-Wesley, 2012',
    isbn: '978-0-321-71411-4',
    tema: 'Programación, C++',
    copias: [
      { campus: 'Casa Central Valparaíso', signatura: '005.133 L765 2012', total: 2, disponibles: 2 }
    ],
    digital: null,
    capitulos: []
  },
  {
    id: 'calculo-stewart',
    titulo: 'Cálculo de una variable: trascendentes tempranas',
    autor: 'James Stewart',
    edicion: '8a ed.',
    editorial: 'Cengage Learning, 2018',
    isbn: '978-607-526-549-8',
    tema: 'Matemáticas, cálculo diferencial e integral',
    copias: [
      { campus: 'San Joaquín', signatura: '515 S849 2018', total: 6, disponibles: 3 },
      { campus: 'Casa Central Valparaíso', signatura: '515 S849 2018', total: 10, disponibles: 4 },
      { campus: 'Sede Viña del Mar', signatura: '515 S849 2018', total: 3, disponibles: 0 }
    ],
    digital: { plataforma: 'eLibro', disponibles: 0 },
    capitulos: ['Funciones y modelos', 'Límites y derivadas', 'Reglas de derivación', 'Aplicaciones de la derivada', 'Integrales']
  },
  {
    id: 'algoritmos-cormen',
    titulo: 'Introduction to Algorithms',
    autor: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    edicion: '3rd ed.',
    editorial: 'MIT Press, 2009',
    isbn: '978-0-262-03384-8',
    tema: 'Algoritmos, estructuras de datos, programación',
    copias: [
      { campus: 'San Joaquín', signatura: '005.1 I61 2009', total: 3, disponibles: 0 },
      { campus: 'Casa Central Valparaíso', signatura: '005.1 I61 2009', total: 4, disponibles: 2 }
    ],
    digital: { plataforma: 'eBook Central', disponibles: 1 },
    capitulos: ['The Role of Algorithms in Computing', 'Getting Started', 'Growth of Functions', 'Divide-and-Conquer', 'Probabilistic Analysis and Randomized Algorithms']
  },
  {
    id: 'fisica-serway',
    titulo: 'Física para ciencias e ingeniería, Vol. 1',
    autor: 'Raymond A. Serway, John W. Jewett',
    edicion: '9a ed.',
    editorial: 'Cengage Learning, 2015',
    isbn: '978-607-519-200-8',
    tema: 'Física, mecánica, electricidad',
    copias: [
      { campus: 'San Joaquín', signatura: '530 S492 2015', total: 5, disponibles: 2 },
      { campus: 'Sede Concepción', signatura: '530 S492 2015', total: 2, disponibles: 1 }
    ],
    digital: { plataforma: 'eLibro', disponibles: 3 },
    capitulos: ['Física y medición', 'Movimiento en una dimensión', 'Vectores', 'Movimiento en dos dimensiones', 'Las leyes del movimiento']
  },
  {
    id: 'algebra-grossman',
    titulo: 'Álgebra lineal',
    autor: 'Stanley I. Grossman, José Job Flores Godoy',
    edicion: '8a ed.',
    editorial: 'McGraw-Hill, 2019',
    isbn: '978-1-4562-6911-5',
    tema: 'Matemáticas, álgebra lineal, matrices',
    copias: [
      { campus: 'San Joaquín', signatura: '512.5 G878 2019', total: 4, disponibles: 4 },
      { campus: 'Vitacura', signatura: '512.5 G878 2019', total: 1, disponibles: 0 }
    ],
    digital: { plataforma: 'eLibro', disponibles: 5 },
    capitulos: ['Sistemas de ecuaciones lineales', 'Vectores y matrices', 'Determinantes', 'Vectores en R2 y R3', 'Espacios vectoriales']
  }
]

export const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export const proximosDias = () => {
  const dias = []
  const d = new Date()
  while (dias.length < 5) {
    if (d.getDay() !== 0) dias.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return dias
}

export const formatoFecha = (d) => d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
