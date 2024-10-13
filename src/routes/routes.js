import express from 'express';
import { Paquete } from '../models/Paquete.js';
import { Registro } from '../models/Registro.js';

const router = express.Router();

// index

router.get('/', (req, res) => {
    res.render('index');
});


// paquetes

router.get('/ver-paquetes', async (req, res) => {
    try {
        const paquetesExistentes = await Paquete.findAll();
        res.render('partials/paquetes/ver-paquetes', {
            paquetes: paquetesExistentes,
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
        console.error('Error al buscar paquetes:', error);
        res.status(500).send('Error al buscar paquetes');
    }
});

router.get('/crear-paquete', (req, res) => {
    try {
        res.render('partials/paquetes/crear-paquete')
    } catch (error) {
        console.error('Error al abrir vista crear-paquete:', error);
        res.status(500).send('Error al abrir vista crear-paquete');
    }
})

router.post('/crear-paquete', async (req, res) => {
    try {
        const { date, shift } = req.body;
        const nuevoPaquete = await Paquete.create({ date, shift });
        console.log('Nuevo paquete creado:', JSON.stringify(nuevoPaquete, null, 2));
        res.redirect('/ver-paquetes');
    } catch (error) {
        console.error('Error al crear el paquete:', error);
        res.status(500).send('Error al crear el paquete');
    }
});

// registros

router.get('/ver-registros', async (req, res) => {
    try {
        const registrosExistentes = await Registro.findAll();
        res.render('partials/registros/ver-registros', {
            registros: registrosExistentes,
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

router.get('/crear-registro', async (req, res) => {
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

router.post('/crear-registro', async (req, res) => {

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