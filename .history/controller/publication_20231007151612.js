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

//* mostrar publicacion

const deletePublication = async (req, res) => {
  try {
    // Obtener el id del usuario logueado
    let publicationId = req.params.id;
    console.log("ID de la publicacion", publicationId);

    

    const deletePublication = await Publication.findById(
      publicationId
    ).deleteMany();

    if (!deletePublication) {
      return res.status(500).json({
        status: "Error",
        mensaje: "Error!!! No has dejado de seguir correctamente al usuario ",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Has dejado de seguir correctamente al usuario ",
      unfollow: followDelete,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje:
        "Error: Por favor verificar si introdujo el id de la publicacion",
    });
  }
};

module.exports = {
  save,
  detail,
  deletePublication,
};
