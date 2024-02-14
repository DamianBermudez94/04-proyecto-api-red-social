const { conexion } = require("./database/conexion");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();


// conectar base de datos
conexion();

// Creamos el servidor de Express
const app = express();
const PORT = process.env.PORT || 3750;
// Arranca la app

// Middleware para permitir solicitudes CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://frond-end-red-social.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  // Middleware para analizar el cuerpo de las solicitudes
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

// configurar politicas de  cors
app.use(cors());

// Convertir el body a un objeto JS // Recibo los datos con content-type aplication/json
app.use(express.json());

// Datos para recibir los datos de un formulario normal
app.use(express.urlencoded({extended:true}));// Recibir datos via form-urlenconded

//Rutas
const routerUser = require("./router/user");
const publicationUser = require("./router/publication");
const routerFollow = require("./router/follow");

app.use("/api/user/",routerUser);
app.use("/api/publication/",publicationUser);
app.use("/api/follow/",routerFollow);


// Crear servidor y escuchar las peticiones http
app.listen(puerto,()=>{
    console.log(`Servidor red social conectado ${PORT}`);
})