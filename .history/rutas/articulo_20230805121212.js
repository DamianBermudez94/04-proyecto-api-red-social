const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const controladorArticulos = require("../controller/articulo");

// Configuración de multer: configuramos donde se van a guardar las imagenes (Storage)
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

const archivosSubidos = multer({storage:almacenamiento})

router.post("/crear",controladorArticulos.crear);
router.get("/articulos/:ultimos?",controladorArticulos.obtener);
router.get("/articulo/:id",controladorArticulos.filtrar);
router.delete("/articulo/:id",controladorArticulos.borrarArticulo);
router.put("/articulo/:id",controladorArticulos.editar);
router.post("/subir-imagen/:id",[archivosSubidos.single("file0")],controladorArticulos.subirImage);
router.get("/imagen/:fichero",controladorArticulos.mostrarImagen);
router.get("/buscar/:busqueda",controladorArticulos.buscarArticulos);

//Exportamos las rutas:

module.exports = router; 