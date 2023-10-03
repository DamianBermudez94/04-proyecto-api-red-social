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

const save = async (req, res) => {
  try {
    // obtenemos los datos del usuario a seguir
    let parametros = req.body;
    console.log("Soy los parametros del body", parametros);
    
    // obtenemos el usuario logueado
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
    let follow = await userToFollow.save();
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
      follow: userToFollow,
    });
  } catch (error) {
    
  }
 
};


const unfollow = async (req, res) => {

    // Obtener el id del usuario logueado
    let userId = req.id;
    console.log("Hola mundi",userId);
    
    // Obtener el id del usuario que sigo y quiero dejar de seguir
    const followId = req.params.id;
    console.log(followId);
  
let followDelete = Follow.find({
  "user":userId,
  "followId":followId
})
console.log(followDelete);
let userDelete  = await followDelete.remove();

  if(!userDelete){
    return res.status(500).json({
      status: "error",
      mensaje: "No has dejado de seguir a nadie ",
     
      
    })
 
}
return res.status(200).json({
  status: "success",
  mensaje: "Has dejado de seguir correctamente al usuario ",
  userId,
  identity:req.user,
  userDelete
  
})
  
    // Guardamos en la base de datos el modelo follow y devolvemos la respuesta
   ;

 
};

module.exports = {
  pruebaFollow,
  save,
  unfollow
};
