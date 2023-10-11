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
        "Error: Por favor verificar que los datos se envien correctamente"
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
        "Error: No se ha podido guardar la publicacion, verificar los datos"
    });
  }

  return res.status(200).json({
    status: "success",
    mensaje: "Publicacion guardada",
    publicationSave,
  });
};

//* mostrar publicacion

const detail = async (req,res)=>{

  // Sacar el id de la publicacion de la url
  let publicationId = req.params.id;
  if (!publicationId.id) {
    return res.status(404).json({
      status: "error",
      mensaje: "Error: Por favor verificar si introdujo el id de la publicacion",
     
      
    });
  }


  // Find con la condicion del id
  let publicacionId = await Publication.findById(publicationId);


  console.log(publicacionId);

  return res.status(200).json({
    status: "success",
    mensaje: "mostrar publicaion",
    params
    
  });
}

module.exports = {
  save,
  detail
};
