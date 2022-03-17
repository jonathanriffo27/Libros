const express = require('express')
const bodyParser = require('body-parser');
const {agregar_libro, get_libros} = require('./db.js')

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
	res.redirect('/autores.html')
})
app.post('/api/libros', async (req, res) => {
	await agregar_libro(req.body.titulo, req.body.descripcion)
	res.redirect('/index.html')
})
app.post('/api/autores', async (req, res) => {
	res.json({todo: 'ok'})
})

app.listen(3000, () => console.log('Servidor ejecutado en puerto 3000'))