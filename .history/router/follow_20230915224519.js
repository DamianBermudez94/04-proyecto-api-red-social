const express = require("express");

const router = express.Router();

// Exportamos los controllers
const followController = require("../controller/follow");


router.post("/follow",followController.pruebaFollow);



//Exportamos las rutas:

module.exports = router;