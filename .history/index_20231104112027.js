const { conexion } = require("./database/conexion");
const express = require("express");

const cors = require("cors");


if (process.env.NODE_ENV == 'production') {
    require('dotenv').config({path:'./.env'})
}

// conectar base de datos
conexion();

// Creamos el servidor de Express
const app = express();
const puerto =  process.env.PORT || 3750;

// Arranca la app
console.log("La app inicializo correctamente");

// configurar politicas de  cors
app.use(cors());
app.use((req,res,next)=>{
    res.append('Access-Control-Allow-Origin',['*']);
    res.append('Access-Control-Allow-Origin','GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.append('Access-Control-Allow-Origin','Content-Type');
    next()
})
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