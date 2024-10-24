import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import { Paquete } from './Paquete.js';

const Registro = sequelize.define('Registro', {
    id_paquete: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paquete,
            key: 'id',
        }
    },
    alto: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    ancho: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    espesor: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    especie: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_pies_tablares: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    total_metros_cubicos: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

export { Registro };
