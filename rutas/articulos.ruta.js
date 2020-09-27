/*=============================================
IMPORTAMOS LA RUTA
=============================================*/

const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Articulos = require ('../controladores/articulos.controlador')

/*=============================================
CREAMOS LA RUTA
=============================================*/
app.get('/mostrar-articulos', Articulos.mostrarArticulos)


/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = app