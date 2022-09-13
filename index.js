const express = require('express');
const apiRoutes = require('./routers/app.routers');
const loggerMiddleware = require('./middlewares/logger');


const PORT = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api', apiRoutes);

// Server
const serverOn = app.listen(PORT, ()=> {
    console.log(`SERVER ON, listening on PORT: ${PORT}`);
});
// Error handler
serverOn.on('error', (error)=> {
    console.error('ERROR', error);
});


