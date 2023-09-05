// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment")

// Importar clave secreta
const libjwt = require("../helper/jwt");
const secret = libjwt.secret
// Funcion de autenticacion