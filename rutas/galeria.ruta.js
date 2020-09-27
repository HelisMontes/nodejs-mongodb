/*=============================================
IMPORTAMOS LA RUTA
=============================================*/

const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Galeria = require ('../controladores/galeria.controlador')

/*=============================================
CREAMOS LA RUTA
=============================================*/
app.get('/mostrar-galeria', Galeria.mostrarGaleria)


/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = app