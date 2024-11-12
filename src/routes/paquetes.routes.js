import express from 'express';
import { Paquete } from '../models/Paquete.js';
import { Registro } from '../models/Registro.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// paquetes
router.get('/ver-paquetes', verifyToken, async (req, res) => {
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
});

router.post('/crear-paquete', verifyToken, async (req, res) => {
    try {
        const { date, shift } = req.body;
        const userId = Number(req.user.id);
        const userEmail = String(req.user.email);

        console.log(userId, userEmail)

        const nuevoPaquete = await Paquete.create({
            user_id: userId,
            user_email: userEmail,
            date,
            shift
        });
        console.log('Nuevo paquete creado:', JSON.stringify(nuevoPaquete, null, 2));
        res.redirect('/ver-paquetes');
    } catch (error) {
        console.error('Error al crear el paquete:', error);
        res.status(500).send('Error al crear el paquete');
    }
});


router.post('/filtrar-paquetes', verifyToken, async (req, res) => {
    try {
        const { filtrar_fecha_creacion, filtrar_turno } = req.body;
        let paquetesFiltrados;

        if (filtrar_fecha_creacion && filtrar_turno) {

            paquetesFiltrados = await Paquete.findAll({
                where: {
                    shift: filtrar_turno,
                },
                order: [['date', filtrar_fecha_creacion]],
            });
        } else if (filtrar_fecha_creacion && !filtrar_turno) {

            paquetesFiltrados = await Paquete.findAll({
                order: [['date', filtrar_fecha_creacion]],
            });
        } else if (filtrar_turno && !filtrar_fecha_creacion) {

            paquetesFiltrados = await Paquete.findAll({
                where: {
                    shift: filtrar_turno,
                }
            });
        } else {
            return res.redirect('/ver-paquetes');
        }

        res.render('partials/paquetes/ver-paquetes', {
            paquetes: paquetesFiltrados,
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
        console.error('Error al aplicar filtros a los paquetes:', error);
        res.status(500).send('Error al aplicar filtros a los paquetes');
    }
});

router.get('/quitar-filtros', verifyToken, async (req, res) => {
    try {
        const paquetes = await Paquete.findAll();

        res.render('partials/paquetes/ver-paquetes', {
            paquetes: paquetes,
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
        console.error('Error al quitar filtros:', error);
        res.status(500).send('Error al quitar filtros');
    }
});

router.get('/paquete/:id', async (req, res) => {
    try {
        const paqueteId = req.params.id;

        const paquete = await Paquete.findByPk(paqueteId);

        const registrosCoincidentes = await Registro.findAll({
            where: {
                id_paquete: paqueteId,
            },
        });

        res.render('partials/paquetes/detalle-paquete', {
            paquete: paquete,
            registros: registrosCoincidentes,
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
        console.error('Error al obtener detalles del paquete:', error);
        res.status(500).render('error', {
            message: 'Error al cargar los detalles del paquete'
        });
    }
});

export default router;
