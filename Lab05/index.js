
const express = require("express");
const app = express();

const PORT = 3000;

// Permitir recibir datos en formato JSON
app.use(express.json());

// GET: ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido a mi API"
    });
});

// GET: consultar el estado del servidor
app.get("/api/status", (req, res) => {
    res.status(200).json({
        status: "OK",
        mensaje: "Servidor funcionando correctamente"
    });
});

// POST: registrar un usuario
app.post("/api/usuarios", (req, res) => {
    const { nombre, edad } = req.body || {};

    // Validar los datos recibidos
    if (
        typeof nombre !== "string" ||
        nombre.trim() === "" ||
        !Number.isInteger(edad) ||
        edad < 0
    ) {
        return res.status(400).json({
            error: "Datos inválidos",
            mensaje: "Se requiere un nombre y una edad válida"
        });
    }

    res.status(201).json({
        mensaje: "Usuario registrado correctamente",
        usuario: {
            nombre,
            edad
        }
    });
});

// Manejar rutas inexistentes (404)
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        mensaje: `La ruta ${req.originalUrl} no existe`
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
