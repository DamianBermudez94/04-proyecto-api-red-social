
const { ValidarArticulo } = require("../helper/validar");
const User = require("../models/user");
// Libreria que sirve para eliminar un archivo no deseado
const fs = require("fs");
// Libreria que me permite cargar un ruta especifica
const path = require("path");

const crearUser = (req, res) => {
  let parametros = req.body;

  // validar datos
  try {
    // Validar información
    ValidarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje:
        "No se ha podido guardar el articulo, por favor verificar los datos al enviar. Gracias!!",
    });
  }

 /* // Crear el objeto a guardar
  const user = new User(parametros);

  const UserGuardado = await articulo.save();
  // Guardamos los  datos en la base de datos (Moongo)*/
  return res.status(200).json({
    status: "success",
    mensaje: "los datos se  han guardado correctamente",
    parametros,
    
  });
};

/*const obtener = async (req, res) => {
  // metodo find sirve para devolver todos los documentos de la coleccion y devuelve todos los campos del documento

  // Metodo sort: sirve para poder ordenar el listado de los elementos

  // Metodo limit: sirve para poder meter un limite al listado obtenido
  try {
    let listado = await Articulos.find({});
    if (req.params.ultimos) {
      listado.limit(3).sort({ fecha: -1 }).exec();
    }

    if (!listado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se han encontrado articulos...",
      });
    }
    return res.status(200).send({
      status: "success",
      contador: listado.length,
      parametro: req.params.ultimos,
      mensaje: "Listado de los articulos obtenidos",
      listado,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Ups!! Ha ocurrido un error....",
      error,
    });
  }
};

const filtrar = (req, res) => {
  //Buscar el id en la base de datos
  let id = req.params.id;
  console.log("soy el id", id);

  // buscamos en la base de datos la lista de elementos

  Articulos.findById(id)
    .then((articulos) => {
      if (!articulos) {
        return res.status(400).json({
          status: "error",
          mensaje: "No se han encontrado articulos...",
        });
      }
      return res.status(200).json({
        status: "success",
        articulos,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Ha ocurrido un error...",
        error,
      });
    });
};

const borrarArticulo = (req, res) => {
  //Buscar el id en la base de datos
  let ariticulo_id = req.params.id;
  console.log("soy el id", ariticulo_id);

  // buscamos en la base de datos la lista de elementos

  const articuloBorrado = Articulos.findOneAndDelete({
    _id: ariticulo_id,
  }).then((articuloBorrado) => {
    if (!articuloBorrado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha podido borrar el articulo",
      });
    }
    return res.status(200).json({
      status: "success",
      articulo: articuloBorrado,
      mensaje: "El articulo fue borrado correctamente",
    });
  });
};
const editar = (req, res) => {
  // Recogemos el id de la base de datos
  let editarId = req.params.id;
  console.log(editarId);
  // Validamos que los datos sean los correctos
  // Recogemos los datos del body

  let parametros = req.body;
  console.log(parametros);
  try {
    ValidarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar gil!!",
    });
  }

  // buscamos el elemento ha editar en la base de datos
  // Metodo findOneAndUpdate: sirve para editar/actulizar un elemento de la base de datos, le pasamos como parametros: el id y los datos del body

  let actulizar = Articulos.findOneAndUpdate({ _id: editarId }, datosBody, {
    new: true,
  }).then((editarArticulo) => {
    console.log("soy el articulo actualizado", editarArticulo);
    if (!editarArticulo) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha podido actualizar el articulo seleccionado",
      });
    }
    return res.status(200).json({
      status: "success",
      mensaje: "El articulo se ha actualizado correctamente",
      articulo: editarArticulo,
    });
  });

  console.log(actulizar);
};
const subirImage = (req, res) => {
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
  crearUser
 
};
