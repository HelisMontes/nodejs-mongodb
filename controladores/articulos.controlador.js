/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Articulos = require ('../modelos/articulos.modelo');

/*=============================================
PETICIONES GET
=============================================*/

let mostrarArticulos =  (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Articulos.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
        Articulos.countDocuments({}, (err, total)=>{

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
    mostrarArticulos
}