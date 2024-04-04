const validator = require("validator");

const validate = (parametros) => {
  let validator_name =
    !validator.isEmpty(parametros.name) &&
    validator.isLength(parametros.name, { min: 3, max: undefined }) &&
    validator.isAlpha(parametros.name, "es-ES");
  let validator_email =
    !validator.isEmpty(parametros.email) && validator.isEmail(parametros.email);
  if (!validator_name || !validator_email) {
    throw new Error("No se ha validado la información");
  } else {
    console.log("Validación superada");
  }
};

module.exports = validate;
