/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/

const express = require('express');

/*=============================================
CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
PETICIONES GET
=============================================*/

app.get('/', (req, res)=>{

	// res.send("Hola Mundo");

	let salida = {

		nombre: "Juan",
		edad: 37,
		url: req.url
	}

	res.send(salida);

})

/*=============================================
SALIDA PUERTO HTTP
=============================================*/
app.listen(4000, ()=>{

	console.log("Habilitado el puerto 4000")
})

