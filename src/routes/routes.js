import express from 'express';
import { Paquete } from '../models/Paquete.js';

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

export default router;