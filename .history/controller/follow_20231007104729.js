const { log } = require("console");
const Follow = require("../models/follow");
const User = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

const followServicie = require("../helper/FollowServices")

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
  

  const followDelete = await Follow.find({
    "user": userId,
    "followed": followId,
  }).deleteMany()


if (!followDelete) {
  return res.status(500).json({
    status: "Error",
    mensaje: "Error!!! No has dejado de seguir correctamente al usuario ",
  });
}



  return res.status(200).json({
    status: "success",
    mensaje: "Has dejado de seguir correctamente al usuario ",
    unfollow:followDelete
   

  });
};


const listadoFollow = async (req, res) => {
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
    const followlist = await Follow.find({user:userId})
      .populate("user followed","-password -role -__v")
      .exec();
 
    if (!followlist) {
      return res.status(404).json({
        status: "Error",
        message: "No hay usuarios disponibles",
      });
    }
    let followUserIds = await followServicie.followUserIds(req.user.id)
    return res.status(200).json({
      status: "success",
      message: "Prueba de usuario existoso",
      followlist,
      itemsPerPage,
      total: followlist.length,
      page,
      pages: Math.ceil(followlist.length / itemsPerPage),
      user_following: followUserIds.following,
      user_follow_me:followUserIds.followers
    });
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message: "No hay usuarios disponibles",
      error,
    });
  }
};

const followers = async (req,res)=>{
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
    const followlist = await Follow.find({user:userId})
      .populate("user","-password -role -__v")
      .exec();
    
    if (!followlist) {
      return res.status(404).json({
        status: "Error",
        message: "No hay usuarios disponibles",
      });
    }
    let followUserIds = await followServicie.followUserIds(req.user.id)
    return res.status(200).json({
      status: "success",
      message: "Prueba de usuario existoso",
      followlist,
      itemsPerPage,
      total: followlist.length,
      page,
      pages: Math.ceil(followlist.length / itemsPerPage),
      user_following: followUserIds.following,
      user_follow_me:followUserIds.followers
    });
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message: "No hay usuarios disponibles",
      error,
    });
  }
}

module.exports = {
  pruebaFollow,
  save,
  unfollow,
  listadoFollow
};
