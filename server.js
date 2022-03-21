const express = require('express')
const path = require("path")
const nunjucks = require("nunjucks")
const bodyParser = require('body-parser')
const {
	agregar_libro, get_libros, agregar_autor, get_autores, add_libro_autor, 
	get_libro, get_autores_no_libro, get_autores_libro, get_autor, 
	get_libros_autor, get_libros_no_autor, eliminar_escriben, eliminar_libro,
	eliminar_autor
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
  res.render('libros.html', {libros});
});
app.get("/autores", async (req,res)=>{
	const autores = await get_autores()
  res.render('autores.html', {autores});
});
app.get("/libro/:libro_id", async (req,res)=>{
	const libro = await get_libro(req.params.libro_id)
	const autores = await get_autores_libro(req.params.libro_id)
	const otros_autores = await get_autores_no_libro(req.params.libro_id)
	// console.log(otros_autores)
  res.render('libro.html', {libro, autores, otros_autores});
});
app.get("/autor/:autor_id", async (req,res)=>{
	const autor = await get_autor(req.params.autor_id)
	// console.log(req.params.autor_id)
	const libros = await get_libros_autor(req.params.autor_id)
	const otros_libros = await get_libros_no_autor(req.params.autor_id)
	// console.log(otros_libros)
  res.render('autor.html', {autor, libros, otros_libros});
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
	res.redirect('/')
})
app.post('/api/autores', async (req, res) => {
	await agregar_autor(req.body.nombre_autor, req.body.apellido_autor, req.body.notas)
	res.redirect('/autores')
})
app.post('/api/escribir/:libro_id/:autor_id', async (req, res) => {
	const autorId = req.body.autor_id
	const libroId = req.params.libro_id
	// console.log(autorId, libroId)
	await add_libro_autor (autorId, libroId)
	res.redirect(`/libro/${req.params.libro_id}`)
})
app.post("/:autor_id/add_libro", async (req,res)=>{
	const libroId = req.body.libro_id
	const autorId = req.params.autor_id
	// console.log('aqui')
	await add_libro_autor (libroId, autorId)
  res.redirect('/autor/'+autorId)
});
app.post("/:libro_id/:autor_id", async (req,res)=>{
	const autorId = req.body.autor_id
	const libroId = req.params.libro_id
	// console.log(autorId, libroId)
	await add_libro_autor (libroId, autorId)
  res.redirect('/libro/'+libroId)
});
app.get("/prestamos", async (req,res)=>{
  res.render('prestamos.html', {});
});
app.post("/eliminar/:libro_id/:autor_id", async (req,res)=>{
	await eliminar_escriben(req.params.libro_id, req.params.autor_id)
  res.redirect(`/libro/${req.params.libro_id}`);
});
app.post("/eliminar2/:libro_id/:autor_id", async (req,res)=>{
	await eliminar_escriben(req.params.libro_id, req.params.autor_id)
  res.redirect(`/autor/${req.params.autor_id}`);
});
app.get("/eliminar/:libro_id", async (req,res)=>{
	// console.log(req.params.libro_id)
	await eliminar_libro(req.params.libro_id)
  res.redirect(`/`);
});
app.get("/eliminar2/:autor_id", async (req,res)=>{
	// console.log(req.params.libro_id)
	await eliminar_autor(req.params.autor_id)
  res.redirect(`/autores`);
});

app.listen(3000, () => console.log('Servidor ejecutado en puerto 3000'))