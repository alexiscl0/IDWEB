require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

const users = [];

let nextId = 1;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email y password son obligatorios.'
            });
        }

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            return res.status(409).json({
                message: 'El usuario ya está registrado.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: nextId++,
            email,
            password: hashedPassword
        };

        users.push(user);

        res.status(201).json({
            message: 'Usuario registrado correctamente.',
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al registrar el usuario.'
        });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(
            user => user.email === email
        );

        if (!user) {
            return res.status(401).json({
                message: 'Credenciales incorrectas.'
            });
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: 'Credenciales incorrectas.'
            });
        }

        req.session.userId = user.id;

        res.json({
            message: 'Inicio de sesión exitoso.',
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al iniciar sesión.'
        });
    }
});