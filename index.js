/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/
require ('./config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

/*=============================================
CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
MIDDLEWARE PARA FILEUPLOAD
=============================================*/

// default options express-fileupload
app.use(fileUpload());

/*=============================================
MONGOOSE DEPRECATIONS
=============================================*/
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/*=============================================
MIDDLEWARE PARA BODY PARSER
=============================================*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));

// parse application/json
app.use(bodyParser.json({limit: '10mb', extended: true}));

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