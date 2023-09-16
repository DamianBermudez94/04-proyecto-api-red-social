const { conexion } = require("./database/conexion");
const express = require("express");

const cors = require("cors");

// Arranca la app
console.log("La app inicializo correctamente");

// conectar base de datos
conexion();
// Creamos el servidor de Express
const app = express();
const puerto = 3750;

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
    console.log("Servidor red social conectado ",puerto);
})