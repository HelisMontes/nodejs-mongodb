/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Slide = require ('../modelos/slide.modelo');

/*=============================================
PETICIONES GET
=============================================*/

let mostrarSlide =  (req, res)=>{

	//https://mongoosejs.com/docs/api.html#model_Model.find

	Slide.find({})
	.exec((err, data)=>{

		if(err){

			return res.json({

				status:500,
				mensaje: "Error en la petición"

			})
		}

		//Contar la cantidad de registros
        Slide.countDocuments({}, (err, total)=>{

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
PETICIONES GET
=============================================*/

let crearSlide =  (req, res)=>{
    //obtenemos el cuerpo del formualrio
    let body = req.body;
    // se obtienen los datos del formulario para enviarlos al modelo
    let crearSlide = new Slide({
        imagen: body.imagen,
        titulo: body.titulo,
        descripcion: body.descripcion
    })

    //Guardamos en MongoDB
	//https://mongoosejs.com/docs/api.html#model_Model-save
	crearSlide.save((err, data)=>{
		if(err){
			return res.json({
				status:400,
				mensaje: "Error al almacenar el slide",
				err
			})
		}
		res.json({
			status:200,
			data,
			mensaje:"El slide ha sido creado con éxito"
		})
	})

}

/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = {
    mostrarSlide,
    crearSlide
}