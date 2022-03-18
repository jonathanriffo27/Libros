const express = require('express')
const bodyParser = require('body-parser');
const {agregar_libro, get_libros, agregar_autor, get_autores, add_libro_autor} = require('./db.js')

const app = express()
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist'))
app.use(express.static('node_modules/axios/dist'))
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json())

app.get('/api/libros', async (req, res) => {
	const libros = await get_libros()
	res.status(200).json(libros)
})
app.get('/api/autores', async (req, res) => {
	const autores = await get_autores()
	res.status(200).json(autores)
})
app.post('/api/libros', async (req, res) => {
	await agregar_libro(req.body.titulo, req.body.descripcion)
	res.redirect('/index')
})
app.post('/api/autores', async (req, res) => {
	await agregar_autor(req.body.nombre_autor, req.body.apellido_autor, req.body.notas)
	res.redirect('/autores')
})
app.post('/api/escribir/:libro_id/:autor_id', async (req, res) => {
	// console.log(req.params)
	await add_libro_autor (req.params.libro_id, req.params.autor_id)
	res.redirect('/autores')
})

app.listen(3000, () => console.log('Servidor ejecutado en puerto 3000'))