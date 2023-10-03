const Follow = require("../models/follow");
const user = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

/*Pasos a seguir para crear las funcionalidades del controller 

1-Accion de guardar un follow ( accion seguir )
2-Accion de borrar un follow (accion dejar de seguir)
3-Accion de listado de usuarios que estoy siguiendo
4-accion listado de usuarios que me siguen

*/

const pruebaFollow = (req, res) => {
  let parametros = req.body;
  console.log("Soy los parametros del body", parametros);
  // validar datos

  return res.status(200).json({
    status: "success",
    mensaje: "Funcion de prueba - Page Follow puto",
    user: req.body,
  });
};

// seguir a un usuario

const save = (req, res) => {
  try {
    // obtenemos los datos del usuario a seguir
    let parametros = req.body;
    console.log("Soy los parametros del body", parametros);
    
    // obtenemos el usuario que va a seguir
    const identity = req.user;
    console.log(identity);
  
    // Creamos el modelo follow con los parametros:
    // Usuario logueado
    // Usuario a seguir
    let userToFollow = new Follow({
      user: identity.id,
      followeb: parametros.followeb,
    });
  
    // Guardamos en la base de datos el modelo follow y devolvemos la respuesta
    let follow = userToFollow.save();
    if (!follow) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error, no se ha podido seguir al usuario",
      
      });
    }
    return res.status(200).json({
      status: "success",
      mensaje: "Has empezado a seguir a:",
      identity: req.user,
      userToFollow: follow,
    });
  } catch (error) {
    
  }
 
};

module.exports = {
  pruebaFollow,
  save,
};
