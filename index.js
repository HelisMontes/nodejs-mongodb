/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/
require ('./config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/*=============================================
CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
MIDDLEWARE PARA BODY PARSER
=============================================*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

app.use( require('./rutas/slide.ruta'))
app.use( require('./rutas/galeria.ruta'))
app.use( require('./rutas/articulos.ruta'))

/*=============================================
CONEXIÓN A LA BASE DE DATOS
=============================================*/

mongoose.connect('mongodb://localhost:27017/apirest', {useNewUrlParser: true,useUnifiedTopology: true}, (err, res)=>{

	if(err) throw err;

	console.log("Conectado a la base de datos")

});

/*=============================================
SALIDA PUERTO HTTP
=============================================*/
app.listen(process.env.PORT, ()=>{

	console.log(`Habilitado el puerto ${process.env.PORT}`)
})