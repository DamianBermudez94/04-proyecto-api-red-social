const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const followController = require("../controller/follow");

/*// Configuración de multer: configuramos donde se van a guardar las imagenes (Storage)
// Metodo diskStorage: configuracion del directorio donde queremos almacenar los archivos (tiene un objeto con dos metodos: destination, filename)
const almacenamiento = multer.diskStorage({
    //file:archivo que se va a subir
    //cb: permite saber el destino del archivo subido
    destination: function(req, file, cb){
        cb(null, "./imagenes/articulos/")
    },
    //filename: conseguir el nombre de cada archivo subido 
    filename: function (req, file, cb) {
        cb(null, "articulos" + Date.now() + file.originalname);
    }
})

// Le pasamos a multer el destino donde queremos almacenar los archivos subidos

const archivosSubidos = multer({storage:almacenamiento})*/

router.post("/crear",followController.crearUser);
/*router.get("/articulos/:ultimos?",userController.obtener);
router.get("/articulo/:id",userController.filtrar);
router.delete("/articulo/:id",userController.borrarArticulo);
router.put("/articulo/:id",userController.editar);
router.post("/subir-imagen/:id",[userController.single("file0")],userController.subirImage);
router.get("/imagen/:fichero",userController.mostrarImagen);
router.get("/buscar/:busqueda",userController.buscarArticulos)*/

//Exportamos las rutas:

module.exports = router; 