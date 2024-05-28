/// Modelagem do banco 

const Sequelize = require('sequelize');
const database = require('./db');
const Usuario = require('./User');
const Produto = require('./Produto'); 

const Favorito = database.define('Favorito', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, // Referencia ao modelo Usuario
            key: 'idUser' // Chave estrangeira referenciada
        }
    },
    ProdutoID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Produto, // Referencia ao modelo Produto
            key: 'ProdutoID' // Chave estrangeira referenciada
        }
    }
});

module.exports = Favorito;
