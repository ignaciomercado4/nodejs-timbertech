import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import { Usuario } from './Usuario.js';

const Paquete = sequelize.define('Paquete', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id',
        }
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    shift: {
        type: DataTypes.ENUM('M', 'T', 'N'),
        allowNull: false
    }
});

export { Paquete };