const express = require("express");

const router = express.Router();

// Exportamos los controllers
const followController = require("../controller/follow");
const userAuth = require("../middleware/auth")


router.post("/prueba-follow",followController.pruebaFollow);
router.post("/save",userAuth.auth,followController.save);
router.delete("/delete-follow",userAuth.auth,followController.deleteFollow);



//Exportamos las rutas:

module.exports = router;