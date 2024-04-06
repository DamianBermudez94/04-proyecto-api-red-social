//* Importar modulos

// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");

// Libreria que me permite cargar un ruta especifica
const path = require("path");

//* Importar Modelos
const Publication = require("../models/publication");
const User = require("../models/user");

//* Importar Servicios

const FollowServices = require("../helper/FollowServices");

/*
 *Guardar publicacion
 *Sacar una publicacion
 *Eliminar una publicacion
 *Listar todas las publicaciones
 *Listar publicaciones del usuario
 *subir ficheros
 *Devolver archivos multimedia ( imagenes )
 */

// *Guardar una publicacion

const save = async (req, res) => {
  let parametros = req.body;

  if (!parametros.text) {
    return res.status(404).json({
      status: "Error",
      mensaje:
        "Error: Por favor verificar que los datos se envien correctamente",
    });
  }

  // Crear y guardar el objeto el modelo

  let newPublication = new Publication(parametros);
  newPublication.user = req.user.id;

  // guardamos el objeto en la base de datos

  let publicationSave = await newPublication.save();

  if (!publicationSave) {
    return res.status(404).json({
      status: "Error",
      mensaje:
        "Error: No se ha podido guardar la publicacion, verificar los datos",
    });
  }

  return res.status(200).json({
    status: "success",
    mensaje: "Publicacion guardada",
    publicationSave,
  });
};

//* mostrar publicacion

const detail = async (req, res) => {
  try {
    // Sacar el id de la publicacion de la url
    let publicationId = req.params.id;
    console.log(publicationId);
    // Find con la condicion del id
    let publicacion = await Publication.findById(publicationId);
    console.log(publicacion);
    return res.status(200).json({
      status: "success",
      mensaje: "mostrar publicaiones",
      publicaciones: publicacion,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje:
        "Error: Por favor verificar si introdujo el id de la publicacion",
    });
  }
};

//* Eliminar publicacion

const deletePublication = async (req, res) => {
  try {
    // Obtener el id del usuario logueado
    let publicationId = req.params.id;

    const deletePublication = await Publication.find({
      user: req.user.id,
      _id: publicationId,
    }).deleteMany();

    return res.status(200).json({
      status: "success",
      mensaje: "Has eliminado correctamente la publicación",
      publication: deletePublication,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      mensaje:
        "Error: Por favor verificar si el ID de la publicacion coincide con el del usuario",
    });
  }
};

// * Listar publicaciones de un usuario

const listPublication = async (req, res) => {
  try {
    // Extraemos el id del usurio
    let userId = req.user.id;

    if (req.params.id) {
      userId = req.params.id;
    }

    // Chequeqamos que "PAGE" siempre sea un entero
    // Controlar en que page estamos
    let page = parseInt(req.params.page) || 1;
    // Limitamos el numero de usuario por pagina
    let itemsPerPage = 5;

    // Consulta con mongoose paginate
    // Como parametro le pasamos UserId ( usuario logueado )
    const listPublications = await User.paginate(
      {},
      { page, limit: itemsPerPage }
    );
    console.log("Soy la lista", listPublications);
    if (!listPublications.docs.length) {
      return res.status(404).json({
        status: "Error",
        message: "No hay usuarios disponibles",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Listado de las publicaciones del usuario:",
      user: req.user,
      listPublications,
      itemsPerPage,
      total: listPublications.length,
      page,
      pages: Math.ceil(listPublications.length / itemsPerPage),
    });
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message:
        "No hay publicaciones disponibles, para poder ver las publicaciones tiene que crear al menos una",
    });
  }
};

const upLoad = async (req, res) => {
  // Configurar multer para poder manipular los archivos que querramos subir ("Se configura en el router")

  //Sacar el id de la publicacion

  let publicationId = req.params.id;

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

  let publicationUpdate = await Publication.findOneAndUpdate(
    { user: req.user.id, _id: publicationId },
    { file: req.file.filename },
    {
      new: true,
    }
  );

  if (!publicationUpdate) {
    return res.status(400).json({
      status: "error",
      mensaje: "No se ha podido actualizar la imagen",
    });
  }
  return res.status(200).json({
    status: "success",
    mensaje: "El articulo se ha actualizado correctamente",
    publication: publicationUpdate,
    fichero: req.file,
  });
};

//* Devolver una imagen
const media = (req, res) => {
  // Recibimos por parametros los datos del fichero
  let file = req.params.file;

  let rutaFisica = "./uploads/publications/" + file;

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

//* Listar todas las publicaciones (feed)
const feed = async (req, res) => {
  try {
    let userId = req.user.id;

    if (req.params.id) {
      userId = req.params.id;
    }
    // Controlar en que page estamos
    let page = 1;
    if (req.params.page) {
      page = req.params.page;
    }
    // Chequeqamos que "PAGE" siempre sea un entero
    page = parseInt(page);

    // Limitamos el numero de usuario por pagina
    let itemsPerPage = 5;

    // Sacar un array de id de usuarios que yo sigo como usuario logueado

    const myFollows = await FollowServices.followUserIds(req.user.id);
    console.log(myFollows);
    // Find a publicaiones pero utilizando el operardor "IN"
    const publications = await Publication.find({ user: myFollows.following })
      .populate("user", "-password -create_at -role -__v -email")
      .sort("-created_at")
      .paginate(page, itemsPerPage);

    console.log("soy las publicaciones", publications);
    return res.status(200).json({
      status: "success",
      message: "Listado de las publicaciones del usuario:",
      following: myFollows.following,
      publications: publications,

      itemsPerPage,
      total: publications.length,
      page,
      pages: Math.ceil(publications.length / itemsPerPage),
    });
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message:
        "No hay publicaciones disponibles, para poder ver las publicaciones tiene que crear al menos una",
    });
  }
};
module.exports = {
  save,
  detail,
  deletePublication,
  listPublication,
  upLoad,
  media,
  feed,
};
