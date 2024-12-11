const Sequelize = require('sequelize');
const database = require('./db');

const Cargo = database.define('cargo', {
    IDCargo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NomeCargo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    Descricao: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    Salario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
    },
    Status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        allowNull: false
    }
});

module.exports = Cargo;
