const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const userController = require("../controller/user");

const userAuth = require("../middleware/auth")

router.post("/register",userAuth.auth,userController.crearUser);
router.post("/login",userController.Login);
router.get("/profile/:id",userAuth.auth,userController.profileUser);
router.get("/prueba-usuario/",userAuth.auth,userController.userPrueba);
router.get("/listado/:page?",userAuth.auth,userController.listadoUser);
router.put("/update/:id",userAuth.auth,userController.userUpdate);

/*router.get("/articulos/:ultimos?",userController.obtener);

router.delete("/articulo/:id",userController.borrarArticulo);
router.put("/articulo/:id",userController.editar);
router.post("/subir-imagen/:id",[userController.single("file0")],userController.subirImage);
router.get("/imagen/:fichero",userController.mostrarImagen);
router.get("/buscar/:busqueda",userController.buscarArticulos)*/

//Exportamos las rutas:

module.exports = router; 