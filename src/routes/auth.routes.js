import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js';

const router = express.Router();
const JWT_SECRET = 'TimberTechClaveJWTPrueba';

// ruta de registro
router.get('/registro', (req, res) => {
    try {
        res.render('partials/usuarios/formulario-registro');
    } catch (error) {
        console.log('Error mostrando formulario de registro.', error);
    }
});

router.post('/registro', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).render('partials/usuarios/formulario-registro', {
                error: 'El email ya está registrado'
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

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/');

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).render('partials/usuarios/formulario-registro', {
            error: 'Error al registrar usuario'
        });
    }
});

// rutas de login
router.get('/login', (req, res) => {
    try {
        res.render('partials/usuarios/formulario-login');
    } catch (error) {
        console.log('Error mostrando formulario de login.', error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).render('partials/usuarios/formulario-login', {
                error: 'Email o contraseña incorrectos'
            });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).render('partials/usuarios/formulario-login', {
                error: 'Email o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/');

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).render('partials/usuarios/formulario-login', {
            error: 'Error al iniciar sesión'
        });
    }
});

// ruta de logout
router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

export default router;