const express = require("express");
const multer = require("multer");
const router = express.Router();

// Exportamos los controllers
const userController = require("../controller/user");

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
    cb(null, "avatar" + Date.now() + "-" + file.originalname);
  },
});

// Le pasamos a multer el destino donde queremos almacenar los archivos subidos

const uploads = multer({ storage: storage });
router.get("/prueba-usuario/", userAuth.auth, userController.userPrueba);
router.post("/register", userController.crearUser);
router.post("/login", userController.Login);
router.get("/profile/:id", userAuth.auth, userController.profileUser);
router.get("/listado/:page?", userAuth.auth, userController.listadoUser);
router.put("/update/", userAuth.auth, userController.userUpdate);
router.post(
  "/upload/",
  [userAuth.auth, uploads.single("file0")],
  userController.upLoad
);
router.get("/uploads/:file",userController.upDateImage);
router.get("/count/:id", userAuth.auth, userController.counter);



//Exportamos las rutas:

module.exports = router;
