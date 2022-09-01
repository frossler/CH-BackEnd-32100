const Contenedor = require('./container.js')
const express = require('express')

const PORT = process.env.PORT || 8080

// EXPRESS Server
const app = express()

const container = new Contenedor('./items/items.json')

app.get('/',(req,res)=> {
    res.send('HOME PAGE')
})
app.get('/login', (req, res)=> {
    res.send('LOGIN PAGE')
})

app.get('/productos', async (req, res)=> {
    const products = await container.getAll().then(res=>res)
    res.json(products)
})
app.get('/productoRandom', async (req, res)=> {
    const products = await container.getAll().then(res=>res)
    const randomProd = Math.floor(Math.random() * products.lenght)
    res.send(products) // randomProd ROMPE // products[randomProd] ROMPE  NaN
})

app.get('/*', (req, res)=> {
    res.send('<h1 style="color: red">PAGE NOT FOUND</h1>')
})

const server = app.listen(PORT, ()=> {
    console.log(`Server is up and running in PORT: ${PORT}`)
})
server.on('error', (error)=> {
    console.log(error)
})