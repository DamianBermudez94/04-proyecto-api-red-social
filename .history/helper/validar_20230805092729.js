const validator = require("validator");

const ValidarArticulo = ( parametros ) =>{  
    let validator_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo,{min:5, max:50}) ;
    let validator_contenido = !validator.isEmpty(parametros.contenido) && validator.isLength(parametros.contenido,{min:5, max:200});
    if (!validator_titulo || !validator_contenido) {
        throw new Error("No se ha validado la información")
    }
}

module.exports= {
    ValidarArticulo
}