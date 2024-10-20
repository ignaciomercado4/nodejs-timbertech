import express from 'express';
import { Paquete } from '../models/Paquete.js';
import { Registro } from '../models/Registro.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// index

router.get('/', verifyToken, (req, res) => {
    res.render('index');
});


// registros

router.get('/ver-registros',verifyToken, async (req, res) => {
    try {
        const registrosExistentes = await Registro.findAll();
        const datosPaquetesPadre = await Promise.all(
            registrosExistentes.map(async (registro) => {
                return await Paquete.findByPk(registro.id_paquete);
            })
        );

        res.render('partials/registros/ver-registros', {
            registros: registrosExistentes,
            datosPaquetesPadre: datosPaquetesPadre,
            helpers: {
                json: function (context) {
                    return JSON.stringify(context, null, 2);
                },
                eq: function (v1, v2) {
                    return v1 === v2;
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar registros:', error);
        res.status(500).send('Error al buscar registros');
    }
});

router.get('/crear-registro',verifyToken, async (req, res) => {
    try {
        const paquetesExistentes = await Paquete.findAll();
        res.render('partials/registros/crear-registro', {
            paquetes: paquetesExistentes
        })
    } catch (error) {
        console.error('Error al abrir vista crear-registro:', error);
        res.status(500).send('Error al abrir vista crear-registro');
    }
});

router.post('/crear-registro',verifyToken, async (req, res) => {

    console.log('Datos recibidos:', req.body);
    try {
        const { id_paquete, alto, ancho, espesor, especie } = req.body;
        const nuevoRegistro = await Registro.create({ id_paquete, alto, ancho, espesor, especie });
        console.log('Nuevo registro creado:', JSON.stringify(nuevoRegistro, null, 2));
        res.redirect('/ver-registros');
    } catch (error) {
        console.error('Error al crear el registro:', error);
        res.status(500).send('Error al crear el registro');
    }
});

export default router;