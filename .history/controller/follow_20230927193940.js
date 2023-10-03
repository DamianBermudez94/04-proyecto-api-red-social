const { log } = require("console");
const Follow = require("../models/follow");
const User = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");


const flatted = require('flatted');
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

const save = async (req, res) => {
  try {
    // obtenemos los datos del usuario a seguir
    const parametros = req.body;


    // obtenemos el usuario logueado
    const identity = req.user;


    // Creamos el modelo follow con los parametros:
    // Usuario logueado
    // Usuario a seguir
    let userToFollow = new Follow({
      user: identity.id,
      followed: parametros.followed
    });
   
    // Guardamos en la base de datos el modelo follow y devolvemos la respuesta
    let followStored = await userToFollow.save();
    if (!followStored) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error, no se ha podido seguir al usuario",
      });
    }
    return res.status(200).json({
      status: "success",
      mensaje: "Has empezado a seguir a:",
      identity: req.user,
      follow:followStored,
    
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error! Asegurase de completar con datos validos",
    });
  }
};

const unfollow = async (req, res) => {
  // Obtener el id del usuario logueado
  let userId = req.user.id;
  console.log("ID del usuario logueado", userId);

  // Obtener el id del usuario que sigo y quiero dejar de seguir
  const followId = req.params.id;
  console.log("ID del usuario a dejar de seguir", followId);

  const followDelete =  Follow.find({
    "user": userId,
    "followId": followId,
  })
  await followDelete.findOneAndReplace()

if (!followDelete) {
  return res.status(500).json({
    status: "Error",
    mensaje: "Error!!! No has dejado de seguir correctamente al usuario ",
  });
}



  return res.status(200).json({
    status: "success",
    mensaje: "Has dejado de seguir correctamente al usuario ",
   

  });
};

module.exports = {
  pruebaFollow,
  save,
  unfollow,
};
