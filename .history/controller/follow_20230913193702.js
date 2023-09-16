
const Follow = require("../models/follow");
const User = require("../models/user")
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

const pruebaFollow = (req, res) => {
  let parametros = req.body;
console.log("Soy los parametros del body",parametros);
  // validar datos

    return res.status(200).json({
      status: "success",
      mensaje: "Funcion de prueba - Page Follow",

      
    });



};



module.exports = {
  pruebaFollow
 
};
