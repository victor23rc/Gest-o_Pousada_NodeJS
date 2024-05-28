/// Modelagem do banco 

const Sequelize = require('sequelize');
const database = require('./db');

const Categoria = database.define('Categoria', {
    CategoriaID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(90),
        allowNull: true
    },
    imagem: {
        type: Sequelize.STRING(500),
        allowNull: true
    }
});

module.exports = Categoria;