import express from 'express';
import { Paquete } from '../models/Paquete.js';

const router = express.Router();

router.get('/ver-paquetes', async (req, res) => {
    try {
        const paquetesExistentes = await Paquete.findAll();
        console.log('Paquetes en el servidor:', JSON.stringify(paquetesExistentes, null, 2));
        res.render('partials/paquetes/ver-paquetes', {
            paquetes: paquetesExistentes,
            helpers: {
                json: function (context) {
                    return JSON.stringify(context, null, 2);
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar paquetes:', error);
        res.status(500).send('Error al buscar paquetes');
    }
});

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