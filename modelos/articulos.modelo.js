/*=============================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articuloSchema = new Schema({

	portada: {
		type: String,
		required: [true, "La portada es obligatoria"]
	},
	titulo: {
		type: String,
		required: [true, "El titulo es obligatoria"]
	},
	intro: {
		type: String,
		required: [true, "El intro es obligatoria"]
	},
	url: {
		type: String,
		required: [true, "La url es obligatoria"]
	},
	contenido: {
		type: String,
		required: [true, "El contenido es obligatoria"]
	}
})

/*=============================================
EXPORTAMOS EL MODELO
=============================================*/

module.exports = mongoose.model("articulos", articuloSchema);