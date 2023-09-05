const { ValidarArticulo } = require("../helper/validar");
const User = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

const puBlication = (req, res) => {
  let parametros = req.body;
console.log("Soy los parametros del body",parametros);
  // validar datos

    return res.status(200).json({
      status: "success",
      mensaje: "Pagina de prueba: Publication",
   
      
    });
  



};


module.exports = {
puBlication
 
};
