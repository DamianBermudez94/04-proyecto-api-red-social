const jwt = require("jsonwebtoken");
const moment = require("moment");

// Clave secreta

const secret = process.env.JWT_SECRET;
console.log("hola",secret);
//Creamo una funcion para generar el token
const createToken = (user)=>{
    const payload = {
        id: user._id,
        name:user.name,
        nick:user.nick,
        email:user.email,
        role:user.role,
        imagen:user.image,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix()
    }

    // Devolvemos el JWT Token codificado
    //Parametros: el objeto payload y la clave secreta
    return jwt.encode(payload,secret)
}


module.exports={
    createToken,
    secret
}