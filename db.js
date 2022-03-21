const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'libros',
  password: '1234',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})

async function agregar_libro (titulo, descripcion) {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `insert into libros (titulo, descripcion) values ($1, $2)
          returning *`,
    values: [titulo, descripcion]
  })
  client.release()
  return rows[0]
}

async function agregar_autor (nombre, apellido, notas) {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `insert into autores (nombre, apellido, notas) values ($1, $2, $3)
          returning *`,
    values: [nombre, apellido, notas]
  })
  client.release()
  return rows[0]
}

async function get_libros() {
  const client = await pool.connect()
  const { rows } = await client.query('select * from libros')
  client.release()
  return rows
}

async function get_autores(id) {
  const client = await pool.connect()
  const { rows } = await client.query('select * from autores')
  client.release()
  return rows
}
async function get_autores_libro(id) {
  const libro_id = parseInt(id)
  const client = await pool.connect()
  const {rows} = await client.query({
    text:'select autores.id, nombre, apellido from escriben join autores on autores.id = escriben.autor_id where libro_id = $1',
    values:[libro_id]
  })
  
  client.release()
  return rows
}
async function get_libros_autor(id) {
  const autor_id = parseInt(id)
  const client = await pool.connect()
  const {rows}= await client.query({
    text:'select libros.id, titulo from escriben join libros on libros.id = escriben.libro_id where autor_id = $1',
    values:[autor_id]
  })
  client.release()
  return rows
}
async function add_libro_autor (libro_id, autor_id){
  const libroId = parseInt(libro_id)
  const autorId = parseInt(autor_id)
  const client = await pool.connect()
  await client.query({
    text: `insert into escriben (libro_id, autor_id) values ($1, $2)
          returning *`,
    values:[libroId, autorId]
  })
  client.release()
}
// async function add_autor_libro (libro_id, autor_id){
//   const libroId = parseInt(libro_id)
//   const autorId = parseInt(autor_id)
//   const client = await pool.connect()
//   await client.query({
//     text: `insert into escriben (libro_id, autor_id) values ($1, $2)
//           returning *`,
//     values:[libroId, autorId]
//   })
//   client.release()
// }
async function get_libro(libro_id){
  const libroId = parseInt(libro_id)
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `select * from libros where id = $1 `,
    values:[libroId]
  })
  client.release()
  return rows[0]
}
async function get_autor(autor_id){
  const autorId = parseInt(autor_id)
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `select * from autores where id = $1 `,
    values:[autorId]
  })
  client.release()
  return rows[0]
}
async function get_autores_no_libro(libro_id){
  const libroId = parseInt(libro_id)
  const client = await pool.connect()
  const { rows } = await client.query({
    text: `select * from autores where id not in (select autor_id from escriben where libro_id = $1)`,
    values:[libroId]
  })
  client.release()
  return rows
}
async function get_libros_no_autor(autor_id) {
  const autorId = parseInt(autor_id)
  const client = await pool.connect()
  // console.log(autor_id)
  const { rows } = await client.query({
    text: `select * from libros where id not in (select libro_id from escriben where autor_id = $1)`,
    values:[autorId]
  })
  client.release()
  // console.log(rows)
  return rows
}
async function eliminar_escriben(libro_id, autor_id) {
  const libroId = parseInt(libro_id)
  const autorId = parseInt(autor_id)
  const client = await pool.connect()
  await client.query({
    text: `delete from escriben where libro_id = $1 and autor_id = $2`,
    values: [libroId, autorId]
  })
  client.release()
  return
}
async function eliminar_libro(libro_id) {
  const libroId = parseInt(libro_id)
  const client = await pool.connect()
  await client.query({
    text: `delete from escriben where libro_id = $1`,
    values: [libroId]
  })
  await client.query({
    text: `delete from libros where id = $1`,
    values: [libroId]
  })
  client.release()
  return
}
async function eliminar_autor(autor_id) {
  const autorId = parseInt(autor_id)
  const client = await pool.connect()
  await client.query({
    text: `delete from escriben where autor_id = $1`,
    values: [autorId]
  })
  await client.query({
    text: `delete from autores where id = $1`,
    values: [autorId]
  })
  client.release()
  return
}

module.exports = {
  agregar_libro, get_libros, agregar_autor, get_autores, add_libro_autor, 
  get_libro, get_autores_no_libro, get_autores_libro, get_autor, 
  get_libros_autor, get_libros_no_autor, eliminar_escriben, eliminar_libro,
  eliminar_autor
}