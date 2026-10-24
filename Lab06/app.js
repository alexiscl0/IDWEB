const express = require('express');
const cursoRoutes = require('./routes/cursoRoutes');
const app = express();

app.use(express.json());

// Middleware propio Logger
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} en ${req.url}`
    );
    next();
});

app.use('/api/v1/curso', cursoRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});