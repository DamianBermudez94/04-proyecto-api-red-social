const express = require("express");

const router = express.Router();

// Exportamos los controllers
const followController = require("../controller/follow");


router.post("/prueba-follow",followController.pruebaFollow);
router.post("/save",followController.pruebaFollow);



//Exportamos las rutas:

module.exports = router;