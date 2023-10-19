//Exportamos el modelo
const User = require("../models/user");
const publication = require("../models/publication");
const Follow = require("../models/follow");
// Dependencia que sirve para paginar con mongo
const mongoosePaginate = require("mongoose-pagination");

// Libreria que sirve para cifrar contraseñas
const bcrypt = require("bcrypt");

const { error, log } = require("console");

const followServicie = require("../helper/FollowServices");

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
  let params = req.body;

  if (!params.email || !params.password) {
    return res
      .status(500)
      .send({ error: "error", message: "Faltan datos por enviar" });
  }
  // Buscar en la Base de datos si existe el usuario
  let user = await User.findOne({ email: params.email }).exec();

  if (!user) {
    return res
      .status(500)
      .send({ error: "error", message: "No existe el usuario" });
  }

  const pwd = bcrypt.compareSync(params.password, user.password);
  if (!pwd) {
    return res.status(500).send({
      error: "error",
      message: "No te has identificado correctamente",
    });
  }

  // Devolver el token
  token = jwt.createToken(user);

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
  try {
    //Buscar el id en la base de datos
    let id = req.params.id;

    //Consulta para sacar el perfil del usuario
    const userProfile = await User.findById(id).select({
      password: 0,
      role: 0,
    });

    if (!userProfile) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado al usuario...",
      });
    }

    // info de seguimiento
    // como parametros le pasamos el id del usuario logueado y el id del perfil del usuario
    const followInfo = await followServicie.followThisUser(req.user.id, id);

    return res.status(200).json({
      status: "success",
      user: userProfile,
      following: followInfo.following,
      followers: followInfo.follower,
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

    let followUserIds = await followServicie.followUserIds(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Prueba de usuario existoso",
      user: userlist,
      itemsPerPage,
      total: userlist.length,
      page,
      pages: Math.ceil(userlist.length / itemsPerPage),
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers,
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
  // Recoger info del usuario a actualizar
  let userIdentity = req.user;
  let userToUpdate = req.body;

  //Eliminar campos sobrantes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  // Comprobar si el usuario existe

  let userExist = await User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nick: userToUpdate.nick.toLowerCase() },
    ],
  });
console.log(userExist);
  let userIsset = false;
  userExist.forEach((user) => {
    if (user && user._id != userIdentity.id) userIsset = true;
  });

  if (userIsset) {
    return res.status(404).json({
      status: "succes",
      mensaje: "el usuario ya existe",
    });
  }
  // Cifrar cobtraseña
  if (userToUpdate.password) {
    let pwd = await bcrypt.hash(userToUpdate.password, 10);
    userToUpdate.password = pwd;
  } else {
    delete userToUpdate.password;
  }
  // Buscar y actualizar
  try {
    let userUpdated = await User.findByIdAndUpdate(
      { _id: userIdentity.id },
      userToUpdate,
      { new: true }
    );

    if (!userUpdated) {
      return res
        .status(400)
        .json({ status: "error", message: "Error al actualizar" });
    }

    // Devolver respuesta
    return res.status(200).send({
      status: "success",
      message: "Metodo de actualizar usuario",
      user: userUpdated,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar",
    });
  }
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

const counter = async (req, res) => {
  let userId = req.user.id;
  if (req.params.id) {
    userId = req.params.id;
  }
  try {
    const following = await Follow.count({ user: userId });
    const followed = await Follow.count({ followeb: userId });
    const publications = await publication.count({ user: userId });

    return res.status(200).json({
      status: "success",
      message: "Lista de usuarios que me siguen",
      userId,
      following: following,
      followed: followed,
      publications: publications,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "",
    });
  }
};

module.exports = {
  crearUser,
  Login,
  profileUser,
  userPrueba,
  listadoUser,
  userUpdate,
  upLoad,
  upDateImage,
  counter,
};
