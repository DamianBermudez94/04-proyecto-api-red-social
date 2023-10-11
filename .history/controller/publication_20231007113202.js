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
const pruebaPublication = (req, res) => {
  let parametros = req.body;

  // validar datos

    return res.status(200).json({
      status: "success",
      mensaje: "Pagina de prueba: Publication",
   
      
    });

};


module.exports = {
pruebaPublication
 
};
