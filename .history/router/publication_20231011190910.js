const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const publicatiionController = require("../controller/publication");
const userAuth = require("../middleware/auth");


// Configuración de multer: configuramos donde se van a guardar las imagenes (Storage)
// Metodo diskStorage: configuracion del directorio donde queremos almacenar los archivos (tiene un objeto con dos metodos: destination, filename)
const storage = multer.diskStorage({
    //file:archivo que se va a subir
    //cb: permite saber el destino del archivo subido
    destination: function (req, file, cb) {
      cb(null, "./uploads/avatars/");
    },
    //filename: conseguir el nombre de cada archivo subido
    filename: function (req, file, cb) {
      cb(null, "pub" + Date.now() + "-" + file.originalname);
    },
  });

// Le pasamos a multer el destino donde queremos almacenar los archivos subidos
const uploads = multer({ storage: storage });


router.post("/save",userAuth.auth,publicatiionController.save);
router.get("/detail/:id",userAuth.auth,publicatiionController.detail);
router.delete("/delete/:id",userAuth.auth,publicatiionController.deletePublication);
router.get("/publications/:id/:page?",userAuth.auth,publicatiionController.listPublication);

router.post("/subir-imagen/:id",userAuth.auth,[uploads.single("file0")],publicatiionController.upLoad);
/*
router.delete("/articulo/:id",userController.borrarArticulo);
router.put("/articulo/:id",userController.editar);
router.post("/subir-imagen/:id",[userController.single("file0")],userController.subirImage);
router.get("/imagen/:fichero",userController.mostrarImagen);
router.get("/buscar/:busqueda",userController.buscarArticulos)*/

//Exportamos las rutas:

module.exports = router;