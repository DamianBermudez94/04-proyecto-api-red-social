const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const publicatiionController = require("../controller/publication");



// Le pasamos a multer el destino donde queremos almacenar los archivos subidos

const archivosSubidos = multer({storage:almacenamiento})

router.post("/publication",publicatiionController);



/*router.get("/articulos/:ultimos?",userController.obtener);
router.get("/articulo/:id",userController.filtrar);
router.delete("/articulo/:id",userController.borrarArticulo);
router.put("/articulo/:id",userController.editar);
router.post("/subir-imagen/:id",[userController.single("file0")],userController.subirImage);
router.get("/imagen/:fichero",userController.mostrarImagen);
router.get("/buscar/:busqueda",userController.buscarArticulos)*/

//Exportamos las rutas:

module.exports = router;