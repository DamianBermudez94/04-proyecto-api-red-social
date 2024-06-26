const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const publicationController = require("../controller/publication");
const userAuth = require("../middleware/auth");


// Configuración de multer: configuramos donde se van a guardar las imagenes (Storage)
// Metodo diskStorage: configuracion del directorio donde queremos almacenar los archivos (tiene un objeto con dos metodos: destination, filename)
const storage = multer.diskStorage({
    //file:archivo que se va a subir
    //cb: permite saber el destino del archivo subido
    destination: function (req, file, cb) {
      cb(null, "./uploads/publications/");
    },
    //filename: conseguir el nombre de cada archivo subido
    filename: function (req, file, cb) {
      cb(null, "pub" + Date.now() + "-" + file.originalname);
    },
  });

// Le pasamos a multer el destino donde queremos almacenar los archivos subidos
const uploads = multer({ storage: storage });


router.post("/save",userAuth.auth,publicationController.save);
router.get("/detail/:id",userAuth.auth,publicationController.detail);
router.delete("/delete/:id",userAuth.auth,publicationController.deletePublication);
router.get("/publications/:id/:page?",userAuth.auth,publicationController.listPublication);
router.post("/upload/:id",userAuth.auth,[uploads.single("file0")],publicationController.upLoad);
router.get("/media/:file",publicationController .media);
router.get("/feed/:page?",userAuth.auth,publicationController.feed)



//Exportamos las rutas:

module.exports = router;