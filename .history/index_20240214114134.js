const { conexion } = require("./database/conexion");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();



// conectar base de datos
conexion();

// Creamos el servidor de Express
const app = express();

// Configura CORS
app.use(cors({
  origin: 'https://frond-end-red-social.vercel.app/', // Cambia esto con tu URL de frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Agrega otros encabezados si es necesario
  credentials: true, // Permite enviar cookies y encabezados de autorización
}));

// Arranca la app
const PORT = process.env.PORT || 3750;



// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Convertir el body a un objeto JS // Recibo los datos con content-type aplication/json
app.use(express.json());

// Datos para recibir los datos de un formulario normal
app.use(express.urlencoded({ extended: true })); // Recibir datos via form-urlenconded

//Rutas
const routerUser = require("./router/user");
const publicationUser = require("./router/publication");
const routerFollow = require("./router/follow");

app.use("/api/user/", routerUser);
app.use("/api/publication/", publicationUser);
app.use("/api/follow/", routerFollow);

// Crear servidor y escuchar las peticiones http
app.listen(PORT, () => {
  console.log(`Servidor red social conectado ${PORT}`);
});
