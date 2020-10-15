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
app.get('/mostrar-galeria', Galeria.mostrarGaleria);
app.post('/crear-galeria', Galeria.crearGaleria);
app.put('/editar-galeria/:id', Galeria.editarGaleria);
app.delete('/borrar-galeria/:id', Galeria.borrarGaleria);



/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = app