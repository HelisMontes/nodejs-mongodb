/*=============================================
IMPORTAMOS EL MODELO
=============================================*/

const Slide = require ('../modelos/slide.modelo');

/*=============================================
ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
=============================================*/

const fs = require('fs');
const { json } = require('body-parser');

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
        });
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
	archivo.mv(`./archivos/slide/${nombre}.${extension}`, err => {
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

let crearSlide = async (req, res)=>{
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
	let slide = new Slide({
		imagen: Nombreimagen.mensaje,
		titulo: body.titulo,
		descripcion: body.descripcion
	})

	//Guardamos en MongoDB
	//https://mongoosejs.com/docs/api.html#model_Model-save
	slide.save((err, data)=>{
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
PETICIONES PUT
=============================================*/
const editarSlide = (req, res)=>{
	//Capturamos el id del slide a actualizar con la palabra reservada params
	let id = req.params.id;

	//Obtenemos el cuerpo del formulario
	let body = req.body;
	
	/*=============================================
	1. VALIDAMOS QUE EL SLIDE SI EXISTA
	=============================================*/	

	//https://mongoosejs.com/docs/api.html#model_Model.findById
	Slide.findById(id, ( err, data) =>{
		//Validamos que no ocurra error en el proceso
		if(err){
			return res.json({
				status: 500,
				mensaje:"Error en el servidor",
				err
			})
		};

		//Validamos que el Slide exista
		if(!data){
			return res.json({
				status: 404,
				mensaje:"El slide no existe en la Base de datos"
			})	
		};

		let rutaImagen = data.imagen;
		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE IMAGEN
		=============================================*/
		const validarCambioArchivo = async (req, rutaImagen)=>{
			try {
				if(req.files){
					// Capturamos el archivo
					let archivo = req.files.archivo;
					let Nombreimagen = await Validarimagen (archivo);
					return {
						status: true,
						mensaje:"El slide ha sido actualizado con éxito",
						res: Nombreimagen.mensaje,
						nueva: true
					};
				}else{
					return {
						status: true,
						mensaje:"El slide ha sido actualizado con éxito",
						res: rutaImagen
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
		const cambiarRegistrosBD = async (id,body,rutaImagen)=>{
			const datosSlide = {

				imagen: rutaImagen,
				titulo: body.titulo,
				descripcion: body.descripcion
			
			};
			let result = null;
        	try {
				result = await Slide.findByIdAndUpdate(id, datosSlide, {new:true, runValidators:true})
			} catch (err) {
				console.log(`entro en el catch`)
				return  {
					status:false,
					mensaje: "Error al modificar los datos en la BD",
					res: err
				};
			}
			return  {
				status:true,
				mensaje: "El slide ha sido actualizado con éxito",
				res: result
			};
		}
		/*=============================================
		SINCRONIZAMOS LAS TAREAS
		=============================================*/
		const actualizarBD = async () =>{
			console.log("Entro en sincronizar")
			const cambioArchivo = await validarCambioArchivo(req, rutaImagen);
			if(!cambioArchivo.status){
				return res.json({
					status: 404,
					mensaje: cambioArchivo.mensaje,
				})
				console.log(`${cambioArchivo.err}`);
			}
			if(cambioArchivo.nueva){
				if(fs.existsSync(`./archivos/slide/${rutaImagen}`)){
					fs.unlinkSync(`./archivos/slide/${rutaImagen}`);
				}
			}
			const registrosBD = await cambiarRegistrosBD(id,body,cambioArchivo.res)
			if(!registrosBD.status){
				return res.json({
					status: 404,
					mensaje: registrosBD.mensaje,
				});
				console.log(`${registrosBD.err}`);
			};
			const datos = registrosBD.res
			res.json({
				status:200,
				datos,
				mensaje:"El slide ha sido actualizado con éxito"
			})
		};
		actualizarBD();
	})

}

/*=============================================
EXPORTAMOS FUNCIONES DEL CONTROLADOR
=============================================*/
module.exports = {
    mostrarSlide,
	crearSlide,
	editarSlide
}