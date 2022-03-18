const express = require('express')
const path = require("path")
const nunjucks = require("nunjucks")
const bodyParser = require('body-parser')
const {
	agregar_libro, get_libros, agregar_autor, get_autores, add_libro_autor,
	get_libro, get_libro_autor, get_autores_libro
} = require('./db.js')

const app = express()
app.use(express.static('public_'))
app.use(express.static('node_modules/bootstrap/dist'))
app.use(express.static('node_modules/axios/dist'))
app.use(bodyParser.urlencoded({ extended: true }));

// se configura nunjucks
nunjucks.configure(path.resolve("templates"), {
  express: app,
  autoscape: true,
  noCache: false,
  watch: true,
});

app.use(express.json())

// Ejemplo
app.get("/", async (req,res)=>{
	const libros = await get_libros()
  res.render('index.html', {libros});
 });
app.get("/autores", async (req,res)=>{
	const autores = await get_autores()
  	res.render('autores.html', {autores});
 });
app.get("/libro/:libro_id", async (req,res)=>{
	const libro = await get_libro(req.params.libro_id)
	const autores = await get_autores_libro(req.params.libro_id)
	const libro_autor = await get_libro_autor(req.params.libro_id)
  res.render('libro.html', {libro, autores, libro_autor});
 });
app.get("/libro", async (req,res)=>{
	const libro ="";
	// console.log(libro)
  res.render('libro.html', {libro});
 });

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
	const autorId = req.body.autor_id
	const libroId = req.params.libro_id
	console.log(autorId, libroId)
	await add_libro_autor (autorId, libroId)

	res.redirect(`/libro/${req.params.libro_id}`)
})
app.post("/:libro_id/:autor_id", async (req,res)=>{
	const autorId = req.body.autor_id
	const libroId = req.params.libro_id
	// await add_libro_autor (autorId, libroId)
	console.log(autorId, libroId)
  	res.redirect('/libro/'+libroId)
 });

app.listen(3000, () => console.log('Servidor ejecutado en puerto 3000'))