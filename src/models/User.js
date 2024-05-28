/// Modelagem do banco 

const Sequelize = require('sequelize');
const database = require('./db');

const ProjetoLoja = database.define('usuario', { 
    idUser: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    endereco: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    telefone: {
        type: Sequelize.INTEGER,
        allowNull: true
    }

});

module.exports = ProjetoLoja;