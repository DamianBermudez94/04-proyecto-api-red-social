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


  return res.status(200).json({
    status: "success",
    mensaje: "Pagina de prueba: Publication",
    parametros,
  });
};

module.exports = {
  save,
};
