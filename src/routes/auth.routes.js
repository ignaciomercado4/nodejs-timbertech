// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js';

const router = express.Router();
const JWT_SECRET = 'TimberTechClaveJWTPrueba';

router.get('/registro', (req, res) => {
    res.render('partials/usuarios/registro');
});

router.post('/registro', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({
                message: 'El email ya está registrado'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: nuevoUsuario.id, email: nuevoUsuario.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: {
                id: nuevoUsuario.id,
                name: nuevoUsuario.name,
                email: nuevoUsuario.email
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({
                message: 'Email o contraseña incorrectos'
            });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({
                message: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
});

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            message: 'Acceso denegado - Token no proporcionado'
        });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.user = verificado;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Token inválido o expirado'
        });
    }
};

router.get('/perfil', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email']
        });

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
});

export default router;