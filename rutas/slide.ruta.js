/*=============================================
IMPORTAMOS LA RUTA
=============================================*/

const express = require('express');
const app = express();

/*=============================================
IMPORTAMOS EL CONTROLADOR
=============================================*/

const Slide = require ('../controladores/slide.controlador')

/*=============================================
CREAMOS LA RUTA
=============================================*/
app.get('/mostrar-slide', Slide.mostrarSlide);
app.post('/crear-slide', Slide.crearSlide);
app.put('/editar-slide/:id', Slide.editarSlide);


/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = app