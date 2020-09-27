/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Galeria = require ('../modelos/galeria.modelo');

/*=============================================
PETICIONES GET
=============================================*/

let mostrarGaleria =  (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Galeria.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
        Galeria.countDocuments({}, (err, total)=>{

            if(err){
        
                return res.json({
        
                    status:500,
                    mensaje: "Error en la petición"
        
                })
            }
        
            res.json({
                status: 200,
                total,
                data
            })
        
        })

	}) 
}
/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = {
    mostrarGaleria
}