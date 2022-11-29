const express = require("express");
const faker = require("faker");
faker.locale = "es";

const { Server: HttpServer } = require("http");
const { Server: Socket } = require("socket.io");

const contenedorDB = require("../contenedores/contenedorDB.js");
const { configMySQL, configSQLite } = require("./config.js");

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

const productosApi = new contenedorDB(configMySQL.config, configMySQL.tabla);
const mensajesApi = new contenedorDB(configSQLite.config, configSQLite.tabla);

io.on("connection", async (socket) => {
  console.log("nuevo cliente conectado");

  socket.emit("productos", await productosApi.listarALL());

  socket.on("update", (producto) => {
    productosApi.guardar(producto);
    io.sockets.emit("productos", productosApi.listarALL());
  });

  socket.emit("mensajes", await mensajesApi.listarALL());

  socket.on("nuevoMensaje", async (mensaje) => {
    mensaje.fyh = new Date().toLocaleString();
    await mensajesApi.guardar(mensaje);
    io.sockets.emit("mensajes", await mensajesApi.listarALL());
  });
});

// faker

let id = 1;
function getNextId() {
  return id++;
}

function crearCombinacionAlAzar(id) {
  return {
    id,
    nombre: faker.name.nombre(),
    apellido: faker.finance.precio(),
    color: faker.image.foto(),
  };
}

function generarProductos(cant) {
  const productosTest = [];
  for (let i = 0; i < cant; i++) {
    productosTest.push(crearCombinacionAlAzar(getNextId()));
  }
  return productosTest;
}

const CANT_PERS_DEFAULT = 5;

app.get("/productos-test", (req, res) => {
  const cant = Number(req.query.cant) || CANT_PERS_DEFAULT;
  res.json(generarProductos(cant));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;

const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor Http escuchando en el puerto ${connectedServer.address().port}`
  );
});

connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
