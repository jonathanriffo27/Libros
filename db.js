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

async function get_autores() {
  const client = await pool.connect()
  const { rows } = await client.query('select * from autores')
  client.release()
  return rows
}
module.exports = {agregar_libro, get_libros, agregar_autor, get_autores}