// Prueba de fetch para el desafio

const express = require ('express');
const { Server: HttpServer } = require ('http');
const { Server: SocketServer } = require ('socket.io');
const Products = require("./model/data");
const Messages = require ('./model/messages')
const dbConfig = require ('./db/config')

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);
const productsDB = new Products('products', dbConfig.mariaDB);
const messagesDB = new Messages("messages", dbConfig.sqlite)




//Middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Variable
const users = [];

//Socket
io.on("connection", async (socket) => {
    console.log(`New User conected!`);
    console.log(`User ID: ${socket.id}`)

//socket.emit('server-message', "Mensaje desde el servidor")
   const products = await productsDB.getAll();
   socket.emit('products', products);

   socket.on('newProduct', async (newProduct) => {
       await productsDB.save(newProduct);
       const updateProducts = await productsDB.getAll(); 
       io.emit('products', updateProducts)      
    });   


    /* io.emit("message", [...messages]); */

    socket.on("new-user", (username) => {
     const newUser = {
       id: socket.id,
       username: username,
     };
     users.push(newUser);
    });

 
    const messages= await messagesDB.getMessages();
    socket.emit("messages", messages);
    /* console.log(messages) */
    socket.on("new-message", async (msj) => {
        await messagesDB.addMessage({email: msj.user, message: msj.message, date: new Date().toLocaleDateString()});
        const messagesLog = await messagesDB.getMessages();
        io.emit("messages", {messagesLog});
    })
})



//Conexión del Servidor
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`🚀Server active and runing on port: ${PORT}`);
  });
  
  connectedServer.on("error", (error) => {
    console.log(`error:`, error.message);
  });