const express = require("express");
const multer = require("multer")
const router = express.Router();

// Exportamos los controllers
const followController = require("../controller/follow");


router.post("/follow",followController.Follow);



//Exportamos las rutas:

module.exports = router;