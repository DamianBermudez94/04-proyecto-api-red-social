const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta

const secret = "CLAVE_SECRETA_del_proyecto_RED_SOCIAL_987987";

//Creamo una funcion para generar el token
export const createToken = (user)=>{
    const payload = {
        id: user._id,
        name:user.name,
        nick:user.nick,
        email:user.email,
        role:user.role,
        imagen:user.image,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix
    }
}