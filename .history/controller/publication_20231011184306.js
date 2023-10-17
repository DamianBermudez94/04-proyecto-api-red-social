const { ValidarArticulo } = require("../helper/validar");
const Publication = require("../models/publication");
const User = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

/*
 *Guardar publicacion
 *Sacar una publicacion
 *Eliminar una publicacion
 *Listar todas las publicaciones
 *Listar publicaciones del usuario
 *subir ficheros
 *Devolver archivos multimedia ( imagenes )
 */

// *Guardar una publicacion

const save = async (req, res) => {
  let parametros = req.body;

  if (!parametros.text) {
    return res.status(404).json({
      status: "Error",
      mensaje:
        "Error: Por favor verificar que los datos se envien correctamente",
    });
  }

  // Crear y guardar el objeto el modelo

  let newPublication = new Publication(parametros);
  newPublication.user = req.user.id;

  // guardamos el objeto en la base de datos

  let publicationSave = await newPublication.save();

  if (!publicationSave) {
    return res.status(404).json({
      status: "Error",
      mensaje:
        "Error: No se ha podido guardar la publicacion, verificar los datos",
    });
  }

  return res.status(200).json({
    status: "success",
    mensaje: "Publicacion guardada",
    publicationSave,
  });
};

//* mostrar publicacion

const detail = async (req, res) => {
  try {
    // Sacar el id de la publicacion de la url
    let publicationId = req.params.id;

    // Find con la condicion del id
    let publicacion = await Publication.findById(publicationId);

    return res.status(200).json({
      status: "success",
      mensaje: "mostrar publicaion",
      publicacion,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje:
        "Error: Por favor verificar si introdujo el id de la publicacion",
    });
  }
};

//* Eliminar publicacion

const deletePublication = async (req, res) => {
  try {
    // Obtener el id del usuario logueado
    let publicationId = req.params.id;

    console.log("ID de la publicacion", publicationId);

    
  
    const deletePublication = await Publication.find(
      {"user":req.user.id, "_id":publicationId}
    ).deleteMany();



    return res.status(200).json({
      status: "success",
      mensaje: "Has eliminado correctamente la publicación",
      publication:deletePublication
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje:
        "Error: Por favor verificar si el ID de la publicacion coincide con el del usuario",
    });
  }
};

// * Listar publicaciones de un usuario


const listPublication = async (req,res)=>{
  try {
    let userId = req.user.id

    if (req.params.id) {
      userId = req.params.id
    }
    // Controlar en que page estamos
    let page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
    // Chequeqamos que "PAGE" siempre sea un entero
    page = parseInt(page);

    // Limitamos el numero de usuario por pagina
    let itemsPerPage = 5;

    // Consulta con mongoose paginate

    // Como parametro le pasamos UserId ( usuario logueado )
    const listPublications = await Publication.find({user:userId}).sort("-create_at").exec();
 
    

    return res.status(200).json({
      status: "success",
      message: "Listado de las publicaciones del usuario:",
      user:req.user,
      listPublications
     
    
    });
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message: "No hay publicaciones disponibles, para poder ver las publicaciones tiene que crear al menos una",
      
    });
  }
}
module.exports = {
  save,
  detail,
  deletePublication,
  listPublication
};
