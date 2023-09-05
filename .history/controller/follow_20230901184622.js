
const Publication = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

const Follow = (req, res) => {
  let parametros = req.body;
console.log("Soy los parametros del body",parametros);
  // validar datos
  try {
    return res.status(200).json({
      status: "success",
      mensaje: "los datos se han guardado correctamente",
      parametros,
      
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje:
        "No se ha podido guardar el articulo, por favor verificar los datos al enviar. Gracias!!",
    });
  }



};



module.exports = {
Follow
 
};
