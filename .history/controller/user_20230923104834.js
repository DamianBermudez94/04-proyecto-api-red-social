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


const userPrueba = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Prueba de usuario existoso",
    usuario: req.user,
  });
};


const crearUser = async (req, res) => {
  let parametros = req.body;

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
  if (!parametros.email || !parametros.password) {
    return res
      .status(500)
      .send({ error: "error", message: "Faltan datos por enviar" });
  }
  // Buscar en la Base de datos si existe el usuario
  let user = await User.findOne({ email: parametros.email }).exec();

  if (!user) {
    return res
      .status(500)
      .send({ error: "error", message: "No existe el usuario" });
  }
  // Devolver el token
  token = jwt.createToken(parametros);
  return res.status(200).send({
    status: "success",
    message: "Login",
    user: {
      id: user.id,
      name: user.name,
      nick: user.name,
    },
    token,
  });
};

const profileUser = async (req, res) => {
  //Buscar el id en la base de datos
  let id = req.params.id;

  //Consulta para sacar el perfil del usuario
  const userProfile = await User.findById(id).select({
    password: 0,
    role: 0,

  });
  try {
    if (!userProfile) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado al usuario...",
      });
    }
  
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


const listadoUser = async (req, res) => {
  try {
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
    const userlist = await User.find()
      .sort("_id")
      .paginate(page, itemsPerPage)
      .exec();

    if (!userlist) {
      return res.status(404).json({
        status: "Error",
        message: "No hay usuarios disponibles",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Prueba de usuario existoso",
      user: userlist,
      itemsPerPage,
      total: userlist.length,
      page,
      pages: Math.ceil(userlist.length / itemsPerPage),
    });
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message: "No hay usuarios disponibles",
      error,
    });
  }
};

const userUpdate = async (req, res) => {
 
  // Recoger la info del usuario a actualizar
  let userIdentidy = req.user;
console.log("hola mundo",userIdentidy);
  // los datos que envia el usuario para actualizar
  let userUpdate = req.body;
console.log(userUpdate);

return res.status(200).send({
  status: "succes",
  message: "El usuario ya existe",
  userIdentidy
});
  // Eliminar campos sobrantes
  /* delete userUpdate.iat;
  delete userUpdate.exp;
  delete userUpdate.role;
  delete userUpdate.image;
  //Comprobar si el usuario existe

  //Chequear que no vengan usuarios duplicados
  //or: Condicion que sirve para comparar un valor yse tiene que cumplir una u otra condición

  /* try {
  const updateUser = User.find({
    $or: [
      { email: userUpdate.email.toLowerCase() },
      { nick: userUpdate.nick.toLowerCase() },
    ],
  });


    const users = await updateUser.exec();
    console.log(users);
    // Creamos una variable que inicie en false
    // luego recorremos el user para comparar que el id
    // sea distinto al del user a modificar y le damos el valor de true
    let userIsset = false;
    users.forEach((user) => {
      if (users && user._id != userIdentidy.id) userIsset = true;
    });
    if (!userIsset) {
      return res.status(200).send({
        status: "succes",
        message: "El usuario ya existe",
      });
    }

    // Cifrar contraseña
    // Parametros: primer parametro, el texto que queremos cifrar, segundo las veces que queremos que lo haga

    if (userUpdate.password) {
      const pwd = await bcrypt.hash(userUpdate.password, 10);

      // Le asignamos a la contraseña el nuevo valor cifrado
      userUpdate.password = pwd;
    }
    // Buscar y actualizar el usuario
    // Parametros: el id del usuario a actualizar
    // El objeto a actualizar
    // y le confirmamos que devuelva el objeto actualizado
    await User.findByIdAndUpdate(req.user.id, userUpdate, {
      new: true,
    }).exec();
    return res.status(200).json({
      status: "success",
      mensaje: "Actualizacion de usuario",
      user: userUpdate,
    });
  } catch (error) {
    return res.status(400).send({
      status: "Error",
      message: "Error al cargar los datos del usuario",
    });
  }*/
};

const upLoad = async (req, res) => {
  // Configurar multer para poder manipular los archivos que querramos subir ("Se configura en el router")

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
    // Le pasamos la ruta del archivo a eliminar
    fs.unlink(req.file.path, (error) => {
      return res.status(404).json({
        status: "error",
        mensaje: "El archivo subido no es valido, comprobar que sea una imagen",
      });
    });
  }
  //Actualizar el archivo

  // buscamos el elemento ha editar en la base de datos
  // Metodo findOneAndUpdate: sirve para editar/actulizar un elemento de la base de datos, le pasamos como parametros: el id y el nombre de la imagen a actualizar

  let userUpdate = await User.findOneAndUpdate(
    { _id: req.user.id },
    { imagen: req.file.filename },
    {
      new: true,
    }
  ).exec();
    console.log("Hola mundo",userUpdate);
  if (!userUpdate) {
    return res.status(400).json({
      status: "error",
      mensaje: "No se ha podido actualizar la imagen",
    });
  }
  return res.status(200).json({
    status: "success",
    mensaje: "El articulo se ha actualizado correctamente",
    user: userUpdate,
    fichero: req.file,
  });
};

const upDateImage = (req, res) => {
  // Recibimos por parametros los datos del fichero
  let fichero = req.params.fichero;

  let rutaFisica = "./uploads/avatars/" + fichero;

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

/*const buscarArticulos = async (req, res) => {
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
  userUpdate,
  upLoad,
  upDateImage,
};
