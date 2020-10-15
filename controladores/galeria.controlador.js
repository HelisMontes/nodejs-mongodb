/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Galeria = require ('../modelos/galeria.modelo');

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/

const fs = require('fs');
const { json } = require('body-parser');


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
VALIDAR IMAGEN
=============================================*/
let Validarimagen = archivo =>{
	
	//Validamos la extensión del archivo
	if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){
		return {
			result:false,
			mensaje: "la imagen debe ser formato JPG o PNG"
		}
	}

	//Validamos el tamaño del archivo
	if(archivo.size > 2000000){
		return {
			result:false,
			mensaje: "la imagen debe ser inferior a 2MB"
		}
	}

	//Cambiar nombre al archivo
	let nombre = Math.floor(Math.random()*10000);

	//Capturar la extensión del archivo
	let extension = archivo.name.split('.').pop();
	
	//Movemos el archivo a la carpeta
	archivo.mv(`./archivos/galeria/${nombre}.${extension}`, err => {
		if(err){
			return {
				result:false,
				mensaje: "Error al guardar la imagen",
				err
			}
		}
	})
	
	return {
		result:true,
		mensaje: `${nombre}.${extension}`
	};
}

/*=============================================
PETICIONES POST
=============================================*/

let crearGaleria = async (req, res)=>{
    //obtenemos el cuerpo del formualrio
    let body = req.body;

	//Preguntamos si viene un archivo
	if(!req.files){
		return res.json({
			status:500,
			mensaje: "La imagen no puede ir vacía"
		})
	}
	// Capturamos el archivo
	let archivo = req.files.archivo;
	let Nombreimagen = await Validarimagen (archivo);

	if(!Nombreimagen.result){
		return res.json({
			status:500,
			mensaje: Nombreimagen.mensaje
		})
	}

	//Obtenemos los datos del formulario para pasarlos al modelo
	let galeria = new Galeria({
		foto: Nombreimagen.mensaje
	})

	//Guardamos en MongoDB
	//https://mongoosejs.com/docs/api.html#model_Model-save
	galeria.save((err, data)=>{
		if(err){
			return res.json({
				status:400,
				mensaje: "Error al almacenar la galeria",
				err
			})
		}

		res.json({
			status:200,
			data,
			mensaje:"La galeria ha sido creado con éxito"
		})
	})
}

/*=============================================
PETICIONES PUT
=============================================*/
const editarGaleria = (req, res)=>{
	//Capturamos el id de la galeria a actualizar con la palabra reservada params
	let id = req.params.id;

	//Obtenemos el cuerpo del formulario
	let body = req.body;
	
	/*=============================================
	1. VALIDAMOS QUE LA GALERIA SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById
	Galeria.findById(id, ( err, data) =>{
		//Validamos que no ocurra error en el proceso
		if(err){
			return res.json({
				status: 500,
				mensaje:"Error en el servidor",
				err
			})
		};

		//Validamos que la galeria exista
		if(!data){
			return res.json({
				status: 404,
				mensaje:"La galeria no existe en la Base de datos"
			})	
		};

        let rutaImagen = data.foto;
		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
		=============================================*/
		const validarCambioArchivo = async (req, rutaImagen)=>{
			try {
				if(req.files){
					// Capturamos el archivo
					let archivo = req.files.archivo;
                    let Nombreimagen = await Validarimagen (archivo);
					// Se borra la imagen anterior
                    if(fs.existsSync(`./archivos/galeria/${rutaImagen}`)){
                        fs.unlinkSync(`./archivos/galeria/${rutaImagen}`);
                    }
					return {
						status: true,
						mensaje:"La galeria ha sido actualizado con éxito",
						res: Nombreimagen.mensaje,
					};
				}else{
					return {
						status: false,
						mensaje:"La imagen no puede ir vacía",
						res: ''
					};
				}
			} catch (error) {
				return  {
					result:false,
					mensaje: "Error al modificar los datos en la BD",
					res: err
				};
			}
		}
		
		/*=============================================
		3. ACTUALIZAMOS LOS REGISTROS
		=============================================*/
		const cambiarRegistrosBD = async (id,rutaImagen)=>{
			const datosGaleria = {
				foto: rutaImagen,
			};
			let result = null;
        	try {
				result = await Galeria.findByIdAndUpdate(id, datosGaleria, {new:true, runValidators:true})
			} catch (err) {
				return  {
					status:false,
					mensaje: "Error al modificar los datos en la BD",
					res: err
				};
			}
			return  {
				status:true,
				mensaje: "La galeria ha sido actualizado con éxito",
				res: result
			};
		}
		/*=============================================
		SINCRONIZAMOS LAS TAREAS
		=============================================*/
		const actualizarBD = async () =>{
			const cambioArchivo = await validarCambioArchivo(req, rutaImagen);
			if(!cambioArchivo.status){
				return res.json({
					status: 404,
					mensaje: cambioArchivo.mensaje,
				})
			}
			
			const registrosBD = await cambiarRegistrosBD(id,cambioArchivo.res)
			if(!registrosBD.status){
				return res.json({
					status: 404,
					mensaje: registrosBD.mensaje,
				});
			};
			const datos = registrosBD.res
			res.json({
				status:200,
				datos,
				mensaje:"La galeria ha sido actualizado con éxito"
			})
		};
		actualizarBD();
	})

}

const borrarGaleria = (req, res)=>{
	//Capturamos el id de la Galeria a borrar con la palabra reservada params
	let id = req.params.id;

	Galeria.findById(id, ( err, data) =>{
		//Validamos que no ocurra error en el proceso
		if(err){
			return res.json({
				status: 500,
				mensaje:"Error en el servidor",
				err
			})
		};

		//Validamos que la Galeria exista
		if(!data){
			return res.json({
				status: 404,
				mensaje:"La galeria no existe en la Base de datos"
			})	
		};
		//Se borra la imagen de la carpeta
		if(fs.existsSync(`./archivos/galeria/${data.foto}`)){
			fs.unlinkSync(`./archivos/galeria/${data.foto}`);
		}
		
		// Borramos registro en MongoDB
		//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
		Galeria.findByIdAndRemove(id, (err, data) =>{
			if(err){
				return res.json({
					status: 500,
					mensaje:"Error al borrar la galeria",
					err
				})
			}

			res.json({
				status:200,
				mensaje: "La galeria ha sido borrado correctamente"
			})
		})

	})
}

/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = {
    mostrarGaleria,
    crearGaleria,
    editarGaleria,
    borrarGaleria
}