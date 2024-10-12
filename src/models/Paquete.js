import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const Paquete = sequelize.define('Paquete', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    shift: {
        type: DataTypes.ENUM('M', 'T', 'Noche'),
        allowNull: false
    }
});

export { Paquete };