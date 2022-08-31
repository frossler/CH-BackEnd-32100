const Contenedor = require('./container.js')
const express = require('express')
const { randomBytes } = require('crypto')
const PORT = process.env.PORT || 8080

const app = express()

app.get('/',(req,res)=> {
    res.send('HOME PAGE')
})
app.get('/login', (req, res)=> {
    res.send('LOGIN PAGE')
})

// la funcion callback es async para poder await 
app.get('/productos', async (req, res)=> {
    let container = new Contenedor('./items/items.json')
    const products = await container.getAll().then(res=>res)
    res.json(products)
})
app.get('/productoRandom', async (req, res)=> {
    let container = new Contenedor('./items/items.json')
    const products = await container.getAll().then(res=>res)
    const randomProd = products[Math.floor(Math.random() * products.lenght)]
    res.send(randomProd)
})
// Si pongo paths debajo de este este path /* me da siempre esta res. 
app.get('/*', (req, res)=> {
    res.send('<h1 style="color: red">PAGE NOT FOUND</h1>')
})

const server = app.listen(PORT, ()=> {
    console.log(`Server is up and running in PORT: ${PORT}`)
})
server.on('error', (error)=> {
    console.log(error)
})