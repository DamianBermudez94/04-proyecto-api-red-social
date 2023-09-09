//Exportamos el modelo
const User = require("../models/user");
// Dependencia que sirve para paginar con mongo
const mongoosePaginate = require("mongoose-pagination");

// Libreria que sirve para cifrar contraseñas
const bcrypt = require("bcrypt");
const { error, log } = require("console");

//Importar Helper JWT
const jwt = require("../helper/jwt");

// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");
const user = require("../models/user");

const crearUser = async (req, res) => {
  let parametros = req.body;
  console.log("Soy los parametros del body", parametros);
  // validar datos
  if (
    !parametros.name ||
    !parametros.email ||
    !parametros.password ||
    !parametros.nick
  ) {
    return res.status(400).json({
      status: "error",
      mensaje:
        "El usuario no se ha podido crear, por favor verificar los datos al enviar. Gracias!!",
    });
  }

  //Chequear que no vengan usuarios duplicados
  //or: Condicion que sirve para comparar un valor yse tiene que cumplir una u otra condición

  const userDuplicado = User.find({
    $or: [
      { email: parametros.email.toLowerCase() },
      { nick: parametros.nick.toLowerCase() },
    ],
  });

  try {
    const resultsDuplicado = await userDuplicado.exec();
    console.log("soy el user duplicado", resultsDuplicado);
    if (resultsDuplicado && resultsDuplicado.length >= 1) {
      return res.status(200).send({
        status: "succes",
        message: "El usuario ya existe",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: "Error",
      message: "Error al cargar los datos del usuario",
    });
  }

  // Cifrar contraseña
  // Parametros: primer parametro, el texto que queremos cifrar, segundo las veces que queremos que lo haga
  const pwd = await bcrypt.hash(parametros.password, 10);

  // Le asignamos a la contraseña el nuevo valor cifrado
  parametros.password = pwd;

  //Crear nuevo usuario
  let nuevoUsuario = new User(parametros);

  // Guardamos el usuario en la base de datos
  const userSave = await nuevoUsuario.save();

  if (!userSave)
    return res
      .status(500)
      .send({ error: "error", message: "Error al cargar el usuario" });

  return res.status(200).json({
    status: "success",
    mensaje: "El usuario se ha registrado correctamente",
    user: userSave,
  });
};

const Login = async (req, res) => {
  //Recoger los parametros que llegan del body
  let parametros = req.body;
  console.log(parametros);
  //Buscar en la base de datos si existe el usuario
  const userExiste = await User.findOne({ email: parametros.email }).exec();

  const results = userExiste;
  console.log("soy el resultado", results);
  if (!results) {
    return res.status(400).send({
      status: "Error",
      message:
        "no se ha encontrado nigun usuario. Por favor verificar los datos enviados",
    });
  }
  console.log(results);
  // Comparar la contraseña
  // Parametros: comparamos la contraseña que viene por parametros y la de la base de datos
  let pwd = bcrypt.compareSync(parametros.password, results.password);

  if (!pwd) {
    return res.status(400).send({
      status: "Error",
      message: "no se ha identificado correctamente",
    });
  }

  // Devolver el token

  token = jwt.createToken(results);
  return res.status(200).send({
    status: "success",
    message: "Login",
    user: {
      id: results._id,
      name: results.name,
      nick: results.nick,
    },
    token,
  });
};

const profileUser = async (req, res) => {
  //Buscar el id en la base de datos
  let id = req.params.id;
  console.log("soy el id", id);

  //Consulta para sacar el perfil del usuario

  const userProfile = await User.findById(id).select({
    password: 0,
    role: 0,
    _id: 0,
  });
  try {
    if (!userProfile) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado articulos...",
      });
    }
    // Posteriormente: Hacer una función para seguimientos de follows
    return res.status(200).json({
      status: "success",
      user: userProfile,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Ha ocurrido un error...",
      error,
    });
  }
};

const userPrueba = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Prueba de usuario existoso",
    usuario: req.user,
  });
};

const listadoUser = async (req, res) => {
  // Controlar en que page estamos
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  // Chequeqamos que "PAGE" siempre sea un entero
  page = parseInt(page);

  // Limitamos el numero de usuario por pagina
  let itemsPerPage = 3;

  // Consulta con mongoose paginate
  User.find()
    .sort("_id")
    .paginate(page, itemsPerPage)
    .then((users) => {
      
      console.log(users);
      if (!users) {
        return res.status(404).json({
          status: "Error",
          message: "No hay usuarios disponibles",
        });
      }
     
      return res.status(200).json({
        status: "success",
        message: "Prueba de usuario existoso",
        users
      });
    });
};
/*const subirImage = (req, res) => {
  // Configurar multer para poder manipular los archivos que querramos subir ("Se configura en el router")
  console.log(req.file);
  // Recoger los datos del fichero de las imagenes subidas
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Petición invalida, por favor verificar subir una imagen",
    });
  }
  //Obtener el nombre del archivo
  let nombreArchivo = req.file.originalname;
  //Obtener la extension del archivo y cortamso el archivo en varias partes para obtner la información requerida

  //Split: Sirve para poder cortar un string en varias parte
  let archivoSplit = nombreArchivo.split(".");
  //Obtenemos la posicion del arquivo requerido
  let archivoExtension = archivoSplit[1];

  //Comprobar extension correcta y eliminamos el archivo no valido
  if (
    archivoExtension != "png" &&
    archivoExtension != "jpg" &&
    archivoExtension != "jpeg" &&
    archivoExtension != "gif"
  ) {
    // Borrar archivo y dar respuesta
    // Le pasamos la ruta del arquivo a eliminar
    fs.unlink(req.file.path, (error) => {
      return res.status(404).json({
        status: "error",
        mensaje: "El archivo subido no es valido, comprobar que sea una imagen",
      });
    });
  } else {
    //Actualizar el archivo

    // Recogemos el id de la base de datos
    let editarId = req.params.id;
    console.log(editarId);

    // buscamos el elemento ha editar en la base de datos
    // Metodo findOneAndUpdate: sirve para editar/actulizar un elemento de la base de datos, le pasamos como parametros: el id y el nombre de la imagen a actualizar

    let actulizar = Articulos.findOneAndUpdate(
      { _id: editarId },
      { imagen: req.file.filename },
      {
        new: true,
      }
    ).then((editarArticulo) => {
      console.log("soy el articulo actualizado", editarArticulo);
      if (!editarArticulo) {
        return res.status(400).json({
          status: "error",
          mensaje: "No se ha podido actualizar la imagen",
        });
      }
      return res.status(200).json({
        status: "success",
        mensaje: "El articulo se ha actualizado correctamente",
        articulo: editarArticulo,
        fichero: req.file,
      });
    });
  }
};

const mostrarImagen = (req, res) => {
  // Recibimos por parametros los datos del fichero
  let fichero = req.params.fichero;
  console.log("Soy el fichero", fichero);
  let rutaFisica = "./imagenes/articulos/" + fichero;
  console.log("ruta fisica", rutaFisica);
  fs.stat(rutaFisica, (error, existe) => {
    if (existe) {
      // respuesta de la ruta fisica del archivo
      return res.sendFile(path.resolve(rutaFisica));
    } else {
      return res.status(400).json({
        status: "error",
        mensaje: "La imagen no existe",
      });
    }
  });
};
const buscarArticulos = async (req, res) => {
  // Sacar el string de busqueda de la ruta
  let parametroBuscador = req.params.busqueda;

  // Metodo find OR: Comprobamos que el dato requerido se el correcto
  let articulos = await Articulos.find({
    $or: [
      // Comprobamos mediante expresiones regulares que los parametros enviados sean compatibles con los de la base de datos
      { titulo: { $regex: parametroBuscador, $options: "i" } },
      { contenido: { $regex: parametroBuscador, $options: "i" } },
    ],
  }).sort({ fecha: -1 }).exec();

    if (!articulos || articulos.length <= 0) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrados articulos ",
      })
    }
    return res.status(200).json({
        status: "success",
        mensaje: "Articulo encontrado exitosamente",
        articulos: articulos,
    });

}*/
module.exports = {
  crearUser,
  Login,
  profileUser,
  userPrueba,
  listadoUser,
};
