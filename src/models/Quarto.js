const Sequelize = require('sequelize');
const database = require('./db');

const Quarto = database.define('quarto', {
    IDQuarto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    NumeroQuarto: {
        type: Sequelize.STRING(10), 
        allowNull: false,
        unique: true 
    },
    Descricao: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    Tipo: {
        type: Sequelize.ENUM('Premium', 'Luxo', 'Standard'),
        allowNull: false
    },
    Valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    Status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
        allowNull: false
    },
    Quantidade: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = Quarto;