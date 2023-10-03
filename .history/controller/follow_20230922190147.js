
const Follow = require("../models/follow");
const user = require("../models/user")
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
console.log("Soy los parametros del body",parametros);
  // validar datos

    return res.status(200).json({
      status: "success",
      mensaje: "Funcion de prueba - Page Follow puto",
      user:req.body

      
    });



};

// seguir a un usuario

const save = (req, res) => {
  let parametros = req.body;
  console.log("Soy los parametros del body",parametros);
  // validar datos
  const identity = req.user;
  console.log(identity);

  let userToFollow = new Follow({
    user: identity.id,
    followeb: parametros.followeb
  })

  userToFollow.save(()=>{
    return res.status(200).json({
      status: "success",
      mensaje: "Funcion de prueba - Page Follow hola",
      identity:req.user,
      userToFollow

      
    });
  })

  



};


module.exports = {
  pruebaFollow,
  save
 
};
