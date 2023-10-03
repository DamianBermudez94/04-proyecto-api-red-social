// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Importar clave secreta
const libjwt = require("../helper/jwt");
const secret = libjwt.secret;

// MIDDLEWERE de autenticacion

exports.auth = (req, res, next) => {
  // Comprobar si me llega la cabecera de auth
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "Error",
      message: "La peticion no tiene la cabecera de autenticacion",
    });
  }
  //Limpiar el token
  let token = req.headers.authorization.replace(/['"]+/g, '');
  //Decodificar el token
  try {
    let payload = jwt.decode(token, secret);
    console.log("hola mundo",payload);
    if (payload.exp <= moment().unix()) {
      return res.status(403).send({
        status: "Error",
        message: "El token a expirado",
      });
    }
    console.log(payload);
    // Agregar los datos del user al request
    req.user = payload;
  } catch (error) {
    return res.status(403).send({
      status: "Error",
      message: "Token invalido",
    });
  }

  // Pasar a ejecucion de accion
  next();
};
